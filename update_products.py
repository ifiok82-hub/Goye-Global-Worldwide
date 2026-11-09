import re

with open('/app/applet/src/data.ts', 'r') as f:
    content = f.read()

# Remove price, priceUSD, priceNGN and add piPrice
# This is a bit fragile, let's just do a big replace.
# The structure is { ... price: X, priceUSD: Y, priceNGN: Z, ... }
# I can use a function to calculate piPrice and reconstruct the object.

def transform_product(match):
    product_obj = match.group(0)
    
    price_usd = 0
    price_match = re.search(r'priceUSD:\s*([0-9.]+)', product_obj)
    if price_match:
        price_usd = float(price_match.group(1))
    else:
        price_match = re.search(r'price:\s*([0-9.]+)', product_obj)
        if price_match:
            price_usd = float(price_match.group(1))
            
    pi_price = max(2, int(price_usd / 30) if price_usd > 0 else 2)
    
    # Remove price, priceUSD, priceNGN
    new_obj = re.sub(r'\s*price:\s*[0-9.]+,?', '', product_obj)
    new_obj = re.sub(r'\s*priceUSD:\s*[0-9.]+,?', '', new_obj)
    new_obj = re.sub(r'\s*priceNGN:\s*[0-9.]+,?', '', new_obj)
    
    # Add piPrice
    new_obj = re.sub(r'(\{)', f'\\1\n    piPrice: {pi_price},', new_obj)
    return new_obj

# This regex is hard. Let me try a simpler approach.
# Just replace the price fields with piPrice in the file.
content = re.sub(r'priceUSD:\s*([0-9.]+)', lambda m: f'piPrice: {max(2, int(float(m.group(1))/30))}', content)
content = re.sub(r'price:\s*[0-9.]+,', '', content)
content = re.sub(r'priceNGN:\s*[0-9.]+,', '', content)

with open('/app/applet/src/data.ts', 'w') as f:
    f.write(content)
