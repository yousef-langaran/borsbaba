// فایل: pages/api/tsetmc.js

import axios from 'axios';

export default async function handler(req, res) {
    // فرض کنیم کاربر نماد رو به شکل ?symbol=SOMENAME می‌فرسته
    const { symbol } = req.query;

    // اگر symbol وارد نشده بود، ارور بده
    if (!symbol) {
        return res.status(400).json({ error: 'پارامتر symbol ارسال نشده است.' });
    }
    try {
        // const response = await axios.get('https://BrsApi.ir/Api/Tsetmc/AllSymbols.php?key=FreeV2lG3EF3ZNdftxiTghLUc7v24KKa');
        const url = `https://cdn.tsetmc.com/api/Instrument/GetInstrumentSearch/${encodeURIComponent(symbol)}`;
        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'دریافت اطلاعات ممکن نشد' });
    }
}
