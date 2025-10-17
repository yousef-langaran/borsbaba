<Input
  type="number"
  step={1000}
  label={type === 'buy' ? 'قیمت خرید' : 'قیمت فروش'}
  value={item.price ? String(item.price) : ''}
  onValueChange={val => handleInputChange(idx, 'price', Number(val))}
/>

<Input
  type="number"
  step={1000}
  label="قیمت اعمال"
  value={item.strikePrice ? String(item.strikePrice) : ''}
  onValueChange={val => handleInputChange(idx, 'strikePrice', Number(val))}
/>

<Input
  type="number"
  step={1000}
  label="قیمت فعلی"
  value={item.currentPrice ? String(item.currentPrice) : ''}
  onValueChange={val => handleInputChange(idx, 'currentPrice', Number(val))}
/>

<Input
  type="number"
  step={1000}
  label="تعداد"
  value={item.count ? String(item.count) : ''}
  onValueChange={val => handleInputChange(idx, 'count', Number(val))}
/>
