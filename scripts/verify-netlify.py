import time
import requests
from bs4 import BeautifulSoup

origin = 'https://akibit.netlify.app'
deadline = time.monotonic() + 360
attempt = 0
while time.monotonic() < deadline:
    attempt += 1
    try:
        response = requests.get(origin, timeout=20)
        page = BeautifulSoup(response.text, 'html.parser')
        if response.status_code == 200 and page.h1 and 'Crafted with intent.' in page.h1.get_text(' ', strip=True) and page.title and 'Akibit' in page.title.get_text():
            break
    except requests.RequestException:
        pass
    if attempt % 3 == 1:
        print('Waiting for the requested Netlify deployment to serve the portfolio...', flush=True)
    time.sleep(10)
else:
    raise SystemExit('Netlify did not serve the portfolio within six minutes; inspect the authoritative deployment status.')

for path, title in [('/', 'Akibit'), ('/privacy', 'Privacy Notice'), ('/accessibility', 'Accessibility')]:
    response = requests.get(origin + path, timeout=30)
    page = BeautifulSoup(response.text, 'html.parser')
    assert response.status_code == 200, (path, response.status_code)
    assert page.h1 and page.title and title in page.title.get_text(), path
    assert page.find('meta', attrs={'name': 'robots', 'content': 'noindex'}), path
    assert page.find('link', attrs={'rel': 'canonical'}), path
    assert not page.select('img[src*="manus-storage"]'), path
    assert page.select_one('button[role="switch"][aria-label="Arcade mode"]'), path
    assert 'akibit-theme' in response.text, path
    print(path + ': meaningful page HTML and review noindex confirmed', flush=True)

for path in ['/__forms.html', '/brand.svg', '/fonts/dm-sans.woff2', '/sitemap.xml', '/robots.txt']:
    response = requests.get(origin + path, timeout=30)
    assert response.status_code == 200, (path, response.status_code)
    print(path + ': reachable', flush=True)

response = requests.get(origin + '/fonts/space-grotesk-700.woff2', timeout=30)
assert response.status_code == 200 and response.content[:4] == b'wOF2'
print('Arcade display font: reachable', flush=True)

for element in page.select('script[src],link[rel="stylesheet"]'):
    source = element.get('src') or element.get('href')
    if source and source.startswith('/assets/'):
        response = requests.get(origin + source, timeout=30)
        assert response.status_code == 200, source
        print('Versioned asset reachable: ' + source, flush=True)

response = requests.get(origin + '/missing-page-netlify-check', timeout=30)
assert response.status_code == 404, response.status_code
assert 'Page not found' in response.text, 'Expected branded not-found page'
print('Unknown route: genuine branded 404 confirmed', flush=True)
print('Public site verification complete. No enquiry was submitted.', flush=True)
