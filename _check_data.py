import json
with open('src/data.json', encoding='utf-8') as f:
    d = json.load(f)
found = [x for x in d if x.get('username') in ('unsoed_foodies','raflychaniag0','tirexx_placetogo')]
print(f'Found {len(found)} accounts')
for x in found:
    print(f'  {x["username"]}: loc={x.get("location_detected")}, cls={x.get("classification")}')
# Also check how many have empty location
no_loc = [x for x in d if not x.get('location_detected')]
print(f'\nTotal di data.json: {len(d)}')
print(f'Tanpa lokasi: {len(no_loc)}')
if no_loc:
    for x in no_loc[:5]:
        print(f'  {x["username"]}: loc={x.get("location_detected")}')
