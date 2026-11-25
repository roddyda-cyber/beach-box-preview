/* Owner question layer for The Beach Box design preview.
   Renders Thai/English questions into .q-slot placeholders and saves each answer to a Google Form (-> Google Sheet).
   Temporary: remove this file and q.css when the owners' answers are in. */
(function () {
  var FORM = 'https://docs.google.com/forms/d/e/1FAIpQLScb8Z4qzhP4PsOVx9jz8o_RnHYNevvZRjeeqeJTlxjKhh_Zow/formResponse';
  var F = { answer: 'entry.736691814', qid: 'entry.1042966067', question: 'entry.658611860', page: 'entry.1701815798' };

  // type: text (default, long answer) | short | choice | checks
  var Q = {
    general: [
      { id: 'design_pick', type: 'choice', th: 'ชอบดีไซน์แบบไหนมากที่สุด?', en: 'Which design do you like best?', opts: [['A', 'A'], ['B', 'B'], ['C', 'C']] },
      { id: 'design_comment', th: 'มีอะไรที่อยากเปลี่ยนในดีไซน์ที่เลือกไหม? (สี รูป ตัวหนังสือ)', en: 'Anything you would change in the design you picked? (colours, photos, wording)' },
      { id: 'rules', th: 'กฎของที่พัก: เวลาเช็คอิน–เช็คเอาท์ จำกัดอายุผู้เข้าพักไหม เวลางดใช้เสียงดัง สัตว์เลี้ยง การสูบบุหรี่', en: 'House rules: check-in and check-out times, any age limit, quiet hours, pets, smoking.' },
      { id: 'payment', type: 'checks', th: 'รับชำระเงินแบบไหนบ้าง?', en: 'Which payment methods do you accept?', opts: [['เงินสด', 'Cash'], ['โอนเงิน / PromptPay', 'Bank transfer / PromptPay'], ['บัตรเครดิต', 'Credit card']] },
      { id: 'company', th: 'ชื่อบริษัทหรือชื่อผู้ประกอบการ และเลขที่ใบอนุญาต (ถ้ามี)', en: 'Company or operator name, and licence number if you have one.' },
      { id: 'domain', type: 'choice', th: 'ชอบชื่อเว็บไซต์ (โดเมน) แบบไหน?', en: 'Which website address (domain) do you prefer?', opts: [['thebeachboxaonang.com', 'thebeachboxaonang.com'], ['beachboxaonang.com', 'beachboxaonang.com'], ['beachboxhostel.com', 'beachboxhostel.com'], ['อื่น ๆ (เขียนในช่องถัดไป)', 'Something else (write it below)']] },
      { id: 'thai_wording', th: 'ภาษาไทยในเว็บไซต์อ่านแล้วเป็นธรรมชาติไหม? ถ้ามีคำหรือประโยคไหนแปลก ช่วยบอกเราว่าอยู่หน้าไหน และควรแก้เป็นอะไร', en: 'Does the Thai on the website read naturally? If any word or sentence sounds odd, tell us which page and how it should read.' },
      { id: 'other', th: 'มีอะไรอยากบอกเพิ่มเติมไหม?', en: 'Anything else you would like to tell us?' }
    ],
    booking: [
      { id: 'book_how', th: 'ลูกค้าจะจองอย่างไร (LINE, WhatsApp, โทรศัพท์)? ต้องจ่ายมัดจำไหม เท่าไร?', en: 'How will guests book (LINE, WhatsApp, phone)? Is there a deposit, and how much?' },
      { id: 'female_room', type: 'choice', th: 'มีห้องสำหรับผู้หญิงล้วนไหม?', en: 'Is there a female-only room?', opts: [['มี', 'Yes'], ['ไม่มี', 'No'], ['ยังไม่แน่ใจ', 'Not sure yet']] },
      { id: 'cancel', th: 'นโยบายการยกเลิกการจองเป็นอย่างไร?', en: 'What is the cancellation policy?' }
    ],
    pool: [
      { id: 'pool_guests', th: 'สระว่ายน้ำเปิดให้แขกทุกคนใช้ไหม? เปิด–ปิดกี่โมง? มีกฎอะไรบ้าง?', en: 'Is the pool open to all guests? What hours? Any rules?' },
      { id: 'beach_steps', type: 'short', th: 'จากประตูที่พักถึงชายหาด ประมาณกี่ก้าวหรือกี่เมตร?', en: 'From the gate to the beach: about how many steps or metres?' }
    ],
    story: [
      { id: 'story', th: 'ช่วยเล่าเรื่องของที่พักสั้น ๆ: ใครเป็นเจ้าของ ทำไมถึงเลือกใช้ตู้คอนเทนเนอร์?', en: 'Tell us the story in a few lines: who owns it, and why shipping containers?' },
      { id: 'open_date', type: 'short', th: 'จะเปิดให้บริการวันที่เท่าไร?', en: 'What is the opening date?' },
      { id: 'headline', th: 'ชอบข้อความหัวเรื่องหน้าแรกไหม? ถ้าอยากเปลี่ยน อยากให้เขียนว่าอะไร?', en: 'Do you like the main headline on the home page? If not, what should it say?' }
    ],
    rooms: [
      { id: 'room_count', type: 'short', th: 'มีห้องพักทั้งหมดกี่ห้อง (กี่ตู้)?', en: 'How many rooms (containers) are there in total?' },
      { id: 'bed_type', type: 'choice', th: 'เตียงเป็นแบบไหน?', en: 'What kind of beds?', opts: [['เตียงสองชั้น', 'Bunk beds'], ['เตียงเดี่ยว', 'Single beds'], ['ทั้งสองแบบ', 'Both']] },
      { id: 'bed_features', type: 'checks', th: 'แต่ละเตียงมีอะไรให้บ้าง? (เลือกทุกข้อที่มี)', en: 'What does each bed come with? (tick all that apply)', opts: [['ล็อกเกอร์', 'Locker'], ['กุญแจล็อกเกอร์', 'Padlock'], ['ไฟอ่านหนังสือ', 'Reading light'], ['ปลั๊กไฟ', 'Power socket'], ['ม่านกั้น', 'Privacy curtain'], ['ผ้าปูที่นอน', 'Bed linen'], ['ผ้าเช็ดตัว', 'Towel'], ['Wi-Fi ฟรี', 'Free Wi-Fi']] },
      { id: 'aircon', th: 'แอร์เปิดได้ตลอด 24 ชั่วโมงไหม? ตู้บุฉนวนกันความร้อนใช่ไหม?', en: 'Does the air conditioning run 24 hours? Are the containers insulated?' },
      { id: 'bathrooms', th: 'ห้องน้ำ: มีฝักบัวกี่จุด ห้องสุขากี่ห้อง มีน้ำอุ่นไหม? แยกชาย–หญิงไหม?', en: 'Bathrooms: how many showers and toilets? Hot water? Separate for men and women?' }
    ],
    prices: [
      { id: 'price_low', type: 'short', th: 'ราคาต่อเตียงต่อคืน ช่วงโลว์ซีซั่น (พ.ค.–ต.ค.) กี่บาท?', en: 'Price per bed per night in low season (May–Oct), in baht?' },
      { id: 'price_high', type: 'short', th: 'ราคาต่อเตียงต่อคืน ช่วงไฮซีซั่น (พ.ย.–เม.ย.) กี่บาท?', en: 'Price per bed per night in high season (Nov–Apr), in baht?' },
      { id: 'price_peak', type: 'short', th: 'ราคาต่อเตียงต่อคืน ช่วงปีใหม่และสงกรานต์ กี่บาท?', en: 'Price per bed per night at New Year and Songkran, in baht?' },
      { id: 'price_room', th: 'ถ้าจองทั้งห้อง (4 เตียง) มีราคาพิเศษไหม?', en: 'Is there a special price for booking the whole room (4 beds)?' }
    ],
    facilities: [
      { id: 'fac_have', type: 'checks', th: 'ที่พักมีอะไรบ้าง? (เลือกทุกข้อที่มี)', en: 'What does the hostel have? (tick all that apply)', opts: [['Wi-Fi', 'Wi-Fi'], ['ล็อกเกอร์', 'Lockers'], ['ที่ฝากกระเป๋า', 'Luggage storage'], ['บริการซักผ้า', 'Laundry'], ['ครัวหรือตู้เย็น', 'Kitchen or fridge'], ['บาร์หรือคาเฟ่', 'Bar or café'], ['อาหารเช้า', 'Breakfast'], ['ที่จอดรถ', 'Parking'], ['แผนกต้อนรับ 24 ชั่วโมง', '24-hour reception'], ['เคาน์เตอร์ทัวร์', 'Tour desk'], ['เช่ามอเตอร์ไซค์', 'Scooter rental']] },
      { id: 'fac_extra', th: 'มีอะไรที่แขกต้องจ่ายเพิ่มไหม (เช่น ผ้าเช็ดตัว ซักผ้า อาหารเช้า)? ราคาเท่าไร?', en: 'Is anything charged extra (towels, laundry, breakfast)? How much?' },
      { id: 'fac_common', th: 'มีพื้นที่ส่วนกลาง บาร์ หรือคาเฟ่ไหม? ช่วยอธิบายสั้น ๆ', en: 'Is there a common area, bar or café? Please describe it briefly.' }
    ],
    address: [
      { id: 'address', th: 'ที่อยู่จริงของที่พัก (ภาษาไทย และภาษาอังกฤษถ้ามี)', en: 'The real street address (in Thai, and in English if you have it).' },
      { id: 'maps_link', type: 'short', th: 'ลิงก์ Google Maps ของที่พัก (ถ้ามี)', en: 'Google Maps link for the property, if you have one.' }
    ],
    transport: [
      { id: 'pickup', th: 'มีบริการรับ–ส่งสนามบินไหม? ราคาเท่าไร?', en: 'Do you offer airport pickup? What does it cost?' },
      { id: 'taxi_price', th: 'ปกติแท็กซี่หรือรถตู้จากสนามบินกระบี่มาที่พัก ราคาประมาณเท่าไร?', en: 'What does a taxi or shuttle from Krabi airport to the hostel normally cost?' },
      { id: 'pier', type: 'short', th: 'ท่าเรือที่ใกล้ที่สุดคือท่าไหน?', en: 'Which is the nearest ferry pier?' }
    ],
    tours: [
      { id: 'tours_sell', type: 'choice', th: 'ที่พักจะขายทัวร์เอง หรือแค่แนะนำให้แขก?', en: 'Will the hostel sell tours itself, or only recommend them?', opts: [['ขายทัวร์เอง', 'Sell tours'], ['แค่แนะนำ', 'Only recommend'], ['ยังไม่แน่ใจ', 'Not sure yet']] },
      { id: 'tours_list', th: 'ทัวร์ไหนบ้างที่อยากให้ขึ้นเว็บ? ราคาเท่าไร? ใช้บริษัททัวร์ไหน?', en: 'Which tours should be on the website? Prices? Which tour company?' }
    ],
    contact: [
      { id: 'phone', type: 'short', th: 'เบอร์โทรศัพท์ของที่พัก', en: 'Phone number' },
      { id: 'whatsapp', type: 'short', th: 'เบอร์ WhatsApp', en: 'WhatsApp number' },
      { id: 'line_id', type: 'short', th: 'LINE ID', en: 'LINE ID' },
      { id: 'email', type: 'short', th: 'อีเมล', en: 'Email address' },
      { id: 'facebook', type: 'short', th: 'ลิงก์เพจ Facebook (ถ้ายังไม่มี กรุณาสร้างเพจ)', en: 'Facebook page link (if there is none yet, please create one)' },
      { id: 'instagram', type: 'short', th: 'ชื่อบัญชี Instagram (ถ้ายังไม่มี กรุณาสร้างบัญชี)', en: 'Instagram account name (if there is none yet, please create one)' },
      { id: 'google_business', type: 'choice', th: 'ลงทะเบียนที่พักบน Google Maps (Google Business Profile) แล้วหรือยัง?', en: 'Is the hostel registered on Google Maps (Google Business Profile) yet?', opts: [['ลงทะเบียนแล้ว', 'Yes'], ['ยังไม่ได้ลงทะเบียน', 'Not yet']] },
      { id: 'hours', type: 'short', th: 'แผนกต้อนรับเปิด–ปิดกี่โมง?', en: 'Reception opening hours?' },
      { id: 'late', th: 'ถ้าแขกมาถึงดึก ต้องทำอย่างไร?', en: 'What should a guest do if they arrive late at night?' },
      { id: 'languages', type: 'short', th: 'พนักงานพูดภาษาอะไรได้บ้าง?', en: 'Which languages do staff speak?' }
    ]
  };

  var ls = { get: function (k) { try { return localStorage.getItem('bbq:' + k) || ''; } catch (e) { return ''; } }, set: function (k, v) { try { localStorage.setItem('bbq:' + k, v); } catch (e) {} } };
  var pageName = (document.body.dataset.theme ? document.body.dataset.theme + '/' + document.body.dataset.lang + '/' + document.body.dataset.page : 'chooser');
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function save(q, value, status) {
    ls.set(q.id, value);
    status.textContent = 'กำลังบันทึก… / Saving…'; status.className = 'q-status';
    var body = new URLSearchParams();
    body.append(F.qid, q.id); body.append(F.question, q.en); body.append(F.answer, value); body.append(F.page, pageName);
    fetch(FORM, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () { status.textContent = 'บันทึกแล้ว ✓ / Saved'; status.className = 'q-status ok'; })
      .catch(function () { status.textContent = 'ยังไม่ได้บันทึก กรุณาลองใหม่ / Not saved, please try again'; status.className = 'q-status bad'; });
  }

  function card(q) {
    var c = el('div', 'q-card'); c.dataset.qid = q.id;
    var lab = el('label', 'q-label'); lab.appendChild(el('span', 'q-th', q.th)); lab.appendChild(el('span', 'q-en', q.en));
    var status = el('span', 'q-status'); var saved = ls.get(q.id); var timer;
    var later = function (get) { return function () { clearTimeout(timer); status.textContent = '…'; timer = setTimeout(function () { save(q, get(), status); }, 1400); }; };
    if (q.type === 'choice' || q.type === 'checks') {
      c.appendChild(lab);
      var group = el('div', 'q-opts'); var picked = saved ? saved.split(' | ') : [];
      var read = function () { return Array.prototype.filter.call(group.querySelectorAll('input'), function (i) { return i.checked; }).map(function (i) { return i.value; }).join(' | '); };
      q.opts.forEach(function (o, n) {
        var w = el('label', 'q-opt'); var i = document.createElement('input');
        i.type = q.type === 'choice' ? 'radio' : 'checkbox'; i.name = 'q-' + q.id; i.id = 'q-' + q.id + '-' + n; i.value = o[0] + ' (' + o[1] + ')';
        if (picked.indexOf(i.value) > -1) i.checked = true;
        i.addEventListener('change', function () { save(q, read(), status); });
        w.appendChild(i); w.appendChild(el('span', 'q-th', o[0])); if (o[1] !== o[0]) w.appendChild(el('span', 'q-en', o[1])); group.appendChild(w);
      });
      c.appendChild(group);
    } else {
      var f = document.createElement(q.type === 'short' ? 'input' : 'textarea');
      f.id = 'q-' + q.id; lab.htmlFor = f.id; if (q.type === 'short') f.type = 'text'; else f.rows = 3;
      f.lang = 'th'; f.placeholder = 'พิมพ์คำตอบที่นี่ (ภาษาไทยได้เลย)'; f.value = saved;
      f.addEventListener('input', later(function () { return f.value; }));
      f.addEventListener('blur', function () { if (f.value !== ls.get(q.id)) { clearTimeout(timer); save(q, f.value, status); } });
      c.appendChild(lab); c.appendChild(f);
    }
    if (saved) { status.textContent = 'บันทึกแล้ว ✓ / Saved'; status.className = 'q-status ok'; }
    c.appendChild(status);
    return c;
  }

  Array.prototype.forEach.call(document.querySelectorAll('.q-slot'), function (slot) {
    var list = Q[slot.dataset.q]; if (!list) return;
    slot.lang = 'th';
    var head = el('div', 'q-head'); head.appendChild(el('span', 'q-th', 'คำถามสำหรับเจ้าของที่พัก')); head.appendChild(el('span', 'q-en', 'Questions for the owners'));
    slot.appendChild(head);
    list.forEach(function (q) { slot.appendChild(card(q)); });
  });

  // Preview bar (theme pages only): explains the page, links back to the chooser, switches design, hides questions.
  if (document.body.dataset.theme) {
    var t = document.body.dataset.theme, lang = document.body.dataset.lang, file = location.pathname.split('/').pop() || 'index.html';
    var bar = el('div', 'q-bar'); bar.lang = 'th';
    var msg = el('div', 'q-bar-msg');
    msg.appendChild(el('span', 'q-th', 'นี่คือตัวอย่างดีไซน์ กรุณาตอบคำถามในกรอบสีเหลือง คำตอบจะบันทึกอัตโนมัติ (อย่าพิมพ์รหัสผ่านหรือข้อมูลธนาคาร)'));
    msg.appendChild(el('span', 'q-en', 'Design preview. Please answer the questions in the yellow boxes. Answers save automatically. (No passwords or bank details.)'));
    var nav = el('div', 'q-bar-nav');
    var back = el('a', 'q-bar-link', '← เลือกดีไซน์ / Designs'); back.href = '../../index.html'; nav.appendChild(back);
    ['a', 'b', 'c'].forEach(function (x) { var a = el('a', 'q-bar-link' + (x === t ? ' on' : ''), x.toUpperCase()); a.href = '../../' + x + '/' + lang + '/' + file; nav.appendChild(a); });
    var tg = el('button', 'q-bar-link', 'ซ่อนคำถาม / Hide questions'); tg.type = 'button';
    tg.addEventListener('click', function () { var off = document.body.classList.toggle('q-off'); tg.textContent = off ? 'แสดงคำถาม / Show questions' : 'ซ่อนคำถาม / Hide questions'; });
    nav.appendChild(tg);
    bar.appendChild(msg); bar.appendChild(nav);
    document.body.insertBefore(bar, document.body.firstChild);
  }
})();
