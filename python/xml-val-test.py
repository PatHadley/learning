import StringIO
from lxml import isoschematron
from lxml import etree

def main():
    # Example adapted from http://lxml.de/validation.html#id2

    f = 'rijksSchema.xml'

    # Parse schema
    sct_doc = etree.parse(f)
    schematron = isoschematron.Schematron(sct_doc, store_report = True)

    # XML to validate
    
    passes = open('rijksDemoPass.xml')
    fails = open('rijksDemoFail.xml')


    # Parse xml
    docPass = etree.parse(passes)
    docFail = etree.parse(fails)

    # Validate against schema
    validationResult = schematron.validate(docPass)
    validationResultFail = schematron.validate(docFail)

    # Validation report 
    report = schematron.validation_report

    print("Did the 'Pass' file pass?: " + str(validationResult))
    print("Did the 'Fail' file pass?: " + str(validationResultFail))
    # print(type(report))
    # print(report)

main()
