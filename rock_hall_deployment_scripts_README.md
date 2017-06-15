# Fabric

[↫ Back to index](./README.md)

Fabric is a Python utility that simplifies running deployment-like commands across multiple servers. Fabric is used to deploy the website to the individual webservers. This is separate to the server configuration in Ansible.


## Deployment via Fabric

Requirements:

1. ruby 2.1.x
  - We recommend using [RVM](https://github.com/rvm/rvm) to manage Ruby versions

2. bundler
  - `gem install bundler`

3. node
  - use [NVM]() to manage Node versions

4. grunt-cli
  - `npm install --global grunt-cli`

5. Fabric 1.8.2
  - `pip install requests`
  - `pip install --no-cache-dir fabric==1.8.2` (requires Python 2.7.x)

6. SSH access
  - Skip if your own key pair is already configured for environment access.
  - Retrieve the `deploy` user key from TPM and save it to `~/.ssh/rockhall/rock_deploy` or else save it in a location and ensure the location in the deployment config file matches.
  - You will also need to have ssh access to your Github account setup and working. You can test this by running `ssh -T git@github.com`
  
Config files exist for each environment. To run a deployment against an environment, use the following command from the `/project/path/deployment/code` directory:

`fab target:<environmentname> deploy`

The deployment can be controlled via the config files that exist for each environment.

By default the following branches will be deployed:
- dev.rockhall.com develop
- staging.rockhall.com develop
- prod.rockhall.com master

### Deploying a feature branch or tag

To deploy a different branch or tag, pass name of the branch or tag as an argument to the deploy function, for example, to deploy the branch `mybranch` to `dev.rockhall.com` run:

`fab target:dev deploy:mybranch`

To deploy the tag `1.2.1` to `www.rockhall.com` run:

`fab target:prod deploy:1.2.1`

You can also set the branch by editing the `git_deploy_branch` variable in the config file. 

### Finding out what branch is deployed to what environment

```
ansible all -i ../configuration/ansible/hosts --private-key=~/.ssh/RHweb.pem -u admin -a "cat /home/deploy/current_branch.txt"
```

### Known issues

Deployments to production can somestimes fail with the error:

```
PDOException: SQLSTATE[40001]: Serialization failure: 1213 Deadlock found when trying to get lock; try restarting transaction: etc etc
```

If this happens, login to the site as an admin user, then go to `Structure > Features` and check the status of the RHOF features set. If the Overridden status for all is `Default` then everything should be fine. NB, Events Calender and Views should be overridden, but if in doubt, revert these features. If any features are overridden select the box and click `Revert` to manually revert them.

You should also check if there are any pending database updates, go to the Home icon in the admin menu's top left and select `Run updates`.

Next clear the site cache, go to the Home icon in the admin menu's top left and select `Flush all caches`.

Browse the site to ensure everything is as you expect, then finally manually take the site out of maintenance mode via the admin menu `Configuration > Development > Maintenance Mode`.
