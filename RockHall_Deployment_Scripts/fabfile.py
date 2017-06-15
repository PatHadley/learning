# Fabfile for Rock Hall deployment
# Runs with:
# Python 2.7.1
# Fabric 1.8.2
# Paramiko 1.17.0
# Requests 2.1.0
#
# The file is pep8 compliant (spaces not tabs) - if using a popular editor like
# Sublime Text then download a linting plugin that will validate against pep8.
# (The one exception to this is line length, since some shell commands can't be
# reasonably cut down to size without comprimising legibility)
#
# Rewritten by NeilH for git, after being shamelessly stolen by MattC
# with inspiration from JoeB, which was written with inspiration from
# BenK's VHS Fabfile, as based on the ACE Fabfile that was
# written by Preloaded and adapted by AlexB.
#
# The deployment workflow operates as follows:
# - Checkout the supplied branch from git and gZip it
# - Build CSS with grunt locally
# - Move files onto the server
# - Move correct settings files into the Drupal sites/default directory
# - (settings files with db creds are encrypted in git and deployed from Ansible)
# - Update file on server in user home dir to notify what branch is on server
# - Apply permissions
# - Run drush functions to setup Drupal
# - Posts a message to Slack on completion

import os.path
from fabric.api import *
from datetime import datetime
from fabric.utils import abort
from fabric.contrib.files import exists
from fabric.colors import *
from fabric.contrib.console import confirm
import ConfigParser
import requests


def deploy(install=False):
  print magenta('Deploying to %(host_name)s' % env, bold=True)
  try:
    confirm_deployment()
    checkoutfiles()
    grunt()
    deployfiles()
    drupal_maintenancemode(1)
    mysql_restart()
    syncdeploy()
    syncsettings()
    syncfiles()
    tag_deploy_on_server()
    applypermissions()
    drupalsetup()
    drupal_maintenancemode(0)
    slack_deploy()
  finally:
    cleanup()


def confirm_deployment():
  """
  Allow a user to confirm or cancel a deployment before it takes place.
  :return:
  """
  require('host_name', provided_by=[target])
  require('git_project', provided_by=[target])
  require('deploy_root', provided_by=[target])
  require('git_deploy_branch', provided_by=[target])

  print yellow('You are about to deploy the following:')
  print cyan("Host: ") + "%(host_name)s (%(hosts)s)" % env
  print cyan("Target: ") + "%(deploy_root)s" % env
  print cyan("Git repository: ") + "%(git_project)s" % env
  print cyan('Branch: ') + env.git_deploy_branch
  print "----------------"

  confirmation = confirm('Is this correct?', False)

  if not confirmation:
    abort(red('You aborted the deployment.'))


# Set up the environment variables required to run this fabfile.
def target(target=''):
  """
  Set up the environment variables required to run this fabfile.
  :param target:
  :return:
  """
  # If there's no config file set, then just bomb out
  if target == '':
    abort(red("No target specified."))

  try:
    config = ConfigParser.SafeConfigParser()
    config.read('%s' % target + '.config')
  except:
    print red('Could not open' + target + '.config.')

  env.deploy_target = target

  try:
    # Get host name
    env.host_name = config.get('Host', 'host_name')

    env.user = config.get('Connection', 'user')
    env.group = config.get('Connection', 'group')
    env.hosts = config.get('Connection', 'hosts').split(', ')

    env.date = datetime.now().strftime('%Y-%m-%d_%H:%M:%S')

    # Get non-standard SSH port if specified
    if config.has_option('Connection', 'port'):
      env.port = config.get('Connection', 'port')

    # Get SSH password or identity file, as appropriate
    if config.has_option('Connection', 'password'):
      env.password = config.get('Connection', 'password')
    elif config.has_option('Connection', 'identity'):
      env.key_filename = config.get('Connection', 'identity')
    else:
      abort(red('Target configuration must specify either a password or an SSH identity file' % env))

    # Get all git information
    for (configItem, configValue) in config.items('Git'):
      setattr(env, configItem, configValue)

    # Get all deployment target info
    for (configItem, configValue) in config.items('Target filesystem'):
      setattr(env, configItem, configValue)

    # Get all Drupal info
    for (configItem, configValue) in config.items('Drupal'):
      setattr(env, configItem, configValue)

  except ConfigParser.NoSectionError as e:
    abort(red(e))
    cleanup()


def checkoutfiles():
  """
  Git clone of the backend files, a specific branch may be passed in via config file.
  :return:
  """

  require('git_deploy_branch', provided_by=[target])

  # by default clone the branches specified in the config script
  branchForClone = '%(git_deploy_branch)s' % env

  # now clone the branches and notify the user which ones are bring used
  print yellow('Cloning ' + branchForClone +  ' branch from git')

  local('git clone --quiet -b ' + branchForClone + ' --single-branch %(git_project)s /tmp/deployment' % env)


def grunt():
  pass
  with lcd('/tmp/deployment/%(git_deploy_dir)s' % env):
    local('npm install')
    local('grunt build')


def deployfiles():
  print yellow('Compressing site files')

  # TAR it up
  local('tar -zcf /tmp/deployment.tar.gz -C /tmp/deployment %(git_deploy_dir)s' % env)
  print yellow('Moving to %(deploy_target)s' % env)
  put('/tmp/deployment.tar.gz', '/tmp/deploymentIncoming.tar.gz')

  # Ensure that we have somewhere to put it
  if not exists('/tmp/deploymentIncoming'):
    run('mkdir /tmp/deploymentIncoming')

  print(yellow('Uncompressing site files'))

  with cd('/tmp'):
    # untar the tarball into a temp location
    run('tar -zxf deploymentIncoming.tar.gz -C deploymentIncoming')


def tag_deploy_on_server():
  with cd('/home/%(user)s' % env):
    run('echo "%(git_deploy_branch)s\n" > current_branch.txt' % env)


def syncdeploy():
  require('deploy_root', provided_by=target)
  require('drupal_path', provided_by=target)
  require('user', provided_by=target)

  if not exists('%(deploy_root)s' % env):
    print yellow('Deployment root does not exist. Creating it now.')
    run('mkdir -p %(deploy_root)s' % env)

  print yellow('Copying files to %(deploy_root)s' % env)

  sudo('cp -R /tmp/deploymentIncoming/%(git_deploy_dir)s %(deploy_root)s/%(drupal_path)s-new' % env)


def syncsettings():
  require('host_name', provided_by=target)

  env.settings_path = '%(deploy_root)s/%(drupal_path)s-new/sites/default' % env
  env.settings_file = '%(host_name)s.settings.php' % env

  print yellow('Syncing settings file.')

  if not exists('%(settings_path)s/%(settings_file)s' % env):
    abort(red('There was no %(settings_file)s found in %(settings_path)' % env))

  sudo('cp %(settings_path)s/%(settings_file)s %(settings_path)s/local.settings.php' % env)


def syncfiles():
  print yellow('Syncing site files.')

  # Perform a backup
  drupal_archive()

  if not exists('%(deploy_root)s/drupalFilesDir/files' % env):
    # Create the drupalFilesDir directory if it doesn't exist.
    sudo('mkdir -p %(deploy_root)s/drupalFilesDir/files' % env)

    # Move any existing files directory into our new one
    if exists('%(deploy_root)s/%(drupal_path)s/sites/default/files' % env):
      sudo('mv %(deploy_root)s/%(drupal_path)s/sites/default/files %(deploy_root)s/drupalFilesDir/files' % env)
  else:
    # Remove the files directory from our deployment so it doesn't blat anything.
    sudo('rm -rf %(deploy_root)s/%(drupal_path)s-new/sites/default/files' % env)

  # Actually deploy our code
  if exists('%(deploy_root)s/%(drupal_path)s' % env):
    sudo('rm -rf %(deploy_root)s/%(drupal_path)s' % env)

  sudo('mv %(deploy_root)s/%(drupal_path)s-new %(deploy_root)s/%(drupal_path)s' % env)

  sudo('ln -s %(deploy_root)s/drupalFilesDir/files %(deploy_root)s/%(drupal_path)s/sites/default/files' % env)


def applypermissions():
  print yellow('Applying permissions.')
  sudo('chown -R rock:www-data %(deploy_root)s/%(drupal_path)s' % env)
  sudo('chown -R www-data:rock %(deploy_root)s/drupalFilesDir' % env)
  sudo('chmod -R 775 %(deploy_root)s/drupalFilesDir/files' % env)


#Put the site into/out of maintenance mode true/false
def drupal_maintenancemode(mode):
  require('deploy_root', provided_by=[target])
  require('drupal_path', provided_by=[target])

  if mode is 1:
    print(yellow('Putting site(s) in maintenance mode'))
  elif mode is 0:
    print(yellow('Taking site(s) out of maintenance mode'))

  with cd ('%(deploy_root)s/%(drupal_path)s' % env):
   run('drush vset --exact --yes maintenance_mode ' + str(mode))


# Restart MySQL to ensure there aren't any open connections
def mysql_restart():
  sudo('service mysql restart')


def drupal_archive():
  require('deploy_root', provided_by=[target])
  require('drupal_path', provided_by=[target])
  require('backup_directory', provided_by=[target])

  print(yellow('Backing up existing site.'))
  if not exists('%(backup_directory)s/rhof' % env):
    sudo('mkdir -p %(backup_directory)s/rhof' % env)

  sudo('chown -R deploy:rock %(backup_directory)s/rhof' % env)
  sudo('chmod -R 775 %(backup_directory)s/rhof' % env)

  with cd ('%(deploy_root)s/%(drupal_path)s' % env):
    run('drush archive-dump --overwrite --destination=%(backup_directory)s/rhof/rhof-deployment-backup.tar' % env)


def drupalsetup():
  require('deploy_root', provided_by=[target])
  require('drupal_path', provided_by=[target])
  require('master_scope', provided_by=[target])

  print(yellow('Performing Drupal configuration tasks'))

  with cd('%(deploy_root)s/%(drupal_path)s' % env):
    run('drush en master -y')
    run('drush master-execute -y --scope=%(master_scope)s' % env)
    run('drush features-revert-all --force -y')
    run('drush updb -y')
    run('drush en rhof -y')
    run('drush vset theme_default rhof')
    run('drush dis bartik -y')


def cleanup():
  """
  Delete temporary files.
  :return:
  """
  print (yellow('Cleaning up'))

  if os.path.exists('/tmp/deployment'):
    local('rm -rf /tmp/deployment')
  if os.path.exists('/tmp/deployment.tar.gz'):
    local('rm /tmp/deployment.tar.gz')

  if exists('/tmp/deploymentIncoming'):
    run('rm -rf /tmp/deploymentIncoming')
  if exists('/tmp/deploymentIncoming.tar.gz'):
    run('rm /tmp/deploymentIncoming.tar.gz')


def slack_deploy():
  require('host_name', provided_by=[target])
  require('git_deploy_branch', provided_by=[target])
  env.repo_link = "https://github.com/rockhallweb/rockhall/tree/%(git_deploy_branch)s" % env
  deploy_message = 'Branch: **%(git_deploy_branch)s** has been deployed to **%(host_name)s**' % env

  a = [{
    "fallback": deploy_message,
    "color": "#36a64f",
    "title": "Deployment status update for https://%(host_name)s.rockhall.com/" % env,
    "title_link": "https://%(host_name)s.rockhall.com/" % env,
    "mrkdwn_in": ["text", "fields"],
    "fields": [
      {
        "title": "Current branch on %(host_name)s" % env,
        "value": "<%(repo_link)s|%(git_deploy_branch)s>" % env,
        "short": "false"
      }
    ]
  }]

  payload = {"channel": "#rockhall", "username": "rock-bot", "icon_emoji": ":rock-bot:", "attachments": a}
  url = "https://hooks.slack.com/services/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"
  r = requests.post(url, json=payload)
