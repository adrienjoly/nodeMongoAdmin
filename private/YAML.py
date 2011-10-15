import yaml, json, sys

print json.dumps(yaml.load(file(sys.argv[1], 'r')))
