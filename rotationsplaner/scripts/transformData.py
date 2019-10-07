import csv

def extract_link(item):
  if len(item) == 0:
    return None
  item = item.replace(' http', '\nhttp')  # fix for no-newline links
  lines = item.split('\n')
  if len(lines) != 2:
    print('error: malformatted link', lines)
    return None
  
  title = lines[0]
  url = lines[1]
  return format_link(title, url)


def format_link(title, url):
  link = f'<a href="{url}">{title}</a>'
  return link


def parse_links(line):
  items = line.split('\n\n')
  parsed = []
  for item in items:
    extracted = extract_link(item)
    if extracted is not None:
      parsed.append(extracted)
  return parsed
  

def parse_task(row):
  contact1 = row['Ansprechpartner 1 (mit Link)']
  contact2 = row['Ansprechpartner 2 (mit Link)']
  regelung_gesetz = row['Link zu Regelung/Gesetz']
  merkblatt = row['Link zu einem Merkblatt']
  formular = row['Link zu einem Formular']
  gesetze_parsed = parse_links(regelung_gesetz)
  gesetze_parsed.extend(parse_links(merkblatt))
  
  
  transformed = {
    'Kategorie': row['Kategorie'],
    'Aufgabe': row['Aufgabe'],
    'Beschreibung': row['Beschreibung'],
    'Gesetz': '\n'.join(gesetze_parsed),
    'Formular': '\n'.join(parse_links(formular))
  }
  
  return transformed


with open('data/Tasks.csv', mode='r') as csv_file:
  csv_reader = csv.DictReader(csv_file)
  transformed = [parse_task(row) for row in csv_reader]
  with open('data/transformed.csv', mode='w') as output:
    fieldnames = transformed[0].keys()
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(transformed)
  



