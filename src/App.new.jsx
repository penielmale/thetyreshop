import { useMemo, useState } from 'react'
import './App.css'
import './Header.css'
import './Booking.css'
import './Chat.css'
import './Admin.css'

const products = [
  { id: 1, brand: 'Continental', name: 'Conti 4x4 Sport Contact', category: 'SUV & 4x4', size: '265/65 R17', rating: 4.8, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/4x4-sport.jpg' },
  { id: 2, brand: 'Continental', name: 'Conti Premium Contact 5', category: 'Premium', size: '225/45 R17', rating: 4.9, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/premium-contact.jpg' },
  { id: 3, brand: 'Continental', name: 'Conti Sport Contact 2', category: 'Touring', size: '205/55 R16', rating: 4.8, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/sport-contact.jpg' },
  { id: 4, brand: 'Continental', name: 'Cross Contact LX 2', category: 'SUV & 4x4', size: '265/60 R18', rating: 4.7, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/cross-contact.jpg' },
  { id: 5, brand: 'Dunlop', name: 'Grandtrek AT22', category: 'SUV & 4x4', size: '245/70 R16', rating: 4.7, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/grand-trek-at22-1.jpg' },
  { id: 6, brand: 'Dunlop', name: 'SP Sport 560', category: 'Touring', size: '215/55 R17', rating: 4.8, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/sp-sport-560-1.jpg' },
  { id: 7, brand: 'General Tire', name: 'Altimax Comfort', category: 'Premium', size: '205/55 R16', rating: 4.6, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/altimax-comfort.jpg' },
  { id: 8, brand: 'General Tire', name: 'Grabber AT3', category: 'SUV & 4x4', size: '265/65 R17', rating: 4.8, image: 'https://tyrezone.co.za/wp-content/uploads/2019/07/grabber-at-3.jpg' },
]

const adminUser = { username: 'admin', password: 'tyrezone' }

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All tyres')
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState('details')
  const [paymentMethod, setPaymentMethod] = useState('payshap')
  const [chatOpen, setChatOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [adminPage, setAdminPage] = useState('bookings')
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' })
  const [adminReply, setAdminReply] = useState('')
  const [bookings, setBookings] = useState([])
  const [quoteRequests, setQuoteRequests] = useState([])
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'user', message: 'Hi, I need a quotation for new tyres.', time: '08:45' },
  ])
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    vehicle: '',
    service: 'Tyre fitment',
    date: '',
    time: '09:00',
  })
  const [quoteForm, setQuoteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicle: '',
    service: 'Tyres',
  })
  const [chatInput, setChatInput] = useState('')

  const filtered = useMemo(() => products.filter((product) => {
    const text = `${product.brand} ${product.name} ${product.size} ${product.category}`.toLowerCase()
    return (category === 'All tyres' || product.category === category) && text.includes(query.toLowerCase())
  }), [category, query])

  const notify = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const handleBookingChange = (field, value) => setBookingForm((prev) => ({ ...prev, [field]: value }))
  const handleQuoteChange = (field, value) => setQuoteForm((prev) => ({ ...prev, [field]: value }))

  const submitBooking = (event) => {
    event.preventDefault()
    setBookingStep('payment')
  }

  const confirmPayment = () => {
    const booking = {
      id: Date.now(),
      ...bookingForm,
      status: 'Confirmed',
      paymentStatus: 'Completed',
      paymentMethod,
      createdAt: new Date().toLocaleString(),
    }
    setBookings((prev) => [booking, ...prev])
    setBookingOpen(false)
    setBookingStep('details')
    setBookingForm({ name: '', phone: '', vehicle: '', service: 'Tyre fitment', date: '', time: '09:00' })
    setPaymentMethod('payshap')
    notify('Booking confirmed — payment completed')
  }

  const submitQuote = (event) => {
    event.preventDefault()
    const quote = {
      id: Date.now(),
      ...quoteForm,
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
    }
    setQuoteRequests((prev) => [quote, ...prev])
    setQuoteOpen(true)
    setQuoteForm({ firstName: '', lastName: '', email: '', phone: '', vehicle: '', service: 'Tyres' })
    notify('Quick quote request submitted')
  }

  const sendChatMessage = (event) => {
    event.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed) return
    setChatMessages((prev) => [...prev, {
      id: Date.now(),
      sender: 'user',
      message: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setChatInput('')
    notify('Message sent — our admin will reply soon')
  }

  const handleAdminLogin = (event) => {
    event.preventDefault()
    if (adminLogin.username === adminUser.username && adminLogin.password === adminUser.password) {
      setAdminLoggedIn(true)
      notify('Admin logged in successfully')
    } else {
      notify('Invalid admin username or password')
    }
  }

  const sendAdminReply = (event) => {
    event.preventDefault()
    const trimmed = adminReply.trim()
    if (!trimmed) return
    setChatMessages((prev) => [...prev, {
      id: Date.now(),
      sender: 'admin',
      message: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setAdminReply('')
    notify('Admin reply sent to chat')
  }

  const markQuoteResponded = (id) => {
    setQuoteRequests((prev) => prev.map((quote) => quote.id === id ? { ...quote, status: 'Responded' } : quote))
    notify('Quote marked as responded')
  }

  const markBookingPaid = (id) => {
    setBookings((prev) => prev.map((booking) => booking.id === id ? { ...booking, paymentStatus: 'Completed' } : booking))
    notify('Booking payment marked as completed')
  }

  return (
    <>
      {notice && <div className="notice-banner">{notice}</div>}
      <div className="utility-bar"><span>SA'S TRUSTED TYRE SPECIALISTS</span><span>Free fitment on 4 tyres · Nationwide delivery</span><a href="tel:0800123456">Call 0800 123 456</a></div>
      <header className="site-header">
        <a className="logo" href="#top"><b>R</b><span>ROAD<span>READY</span></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">☰</button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <a href="#top" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Products</a>
          <div className="more-menu services-menu">
            <button className="more-toggle" onClick={() => setServicesOpen(!servicesOpen)} aria-expanded={servicesOpen}>Services <span>⌄</span></button>
            {servicesOpen && <div className="more-dropdown services-dropdown"><a href="#services" onClick={() => setServicesOpen(false)}>All services</a><a href="#tyre-fitment" onClick={() => setServicesOpen(false)}>Tyre fitment</a><a href="#wheel-alignment" onClick={() => setServicesOpen(false)}>Wheel alignment</a><a href="#puncture-repair" onClick={() => setServicesOpen(false)}>Puncture repair</a><a href="#roadside-assist" onClick={() => setServicesOpen(false)}>Roadside assistance</a></div>}
          </div>
          <a href="#promotions" onClick={() => setMenuOpen(false)}>Promotions</a>
          <a href="#locations" onClick={() => setMenuOpen(false)}>Stores</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact Us</a>
          <div className="more-menu">
            <button className="more-toggle" onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}>More <span>⌄</span></button>
            {moreOpen && <div className="more-dropdown"><a href="#why-us" onClick={() => setMoreOpen(false)}>About Us</a><a href="#brochures" onClick={() => setMoreOpen(false)}>Brochures</a></div>}
          </div>
        </nav>
        <div className="header-actions">
          <button className="header-cta" onClick={() => { setBookingStep('details'); setBookingOpen(true) }}>Book a service <span>↗</span></button>
          <button className="admin-toggle" onClick={() => setAdminOpen(true)}>Admin</button>
        </div>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><i /> THE ROAD STARTS HERE</p>
            <h1>Go further.<br /><em>Feel safer.</em></h1>
            <p className="hero-text">The right tyres change everything. Find yours, get expert advice and have them fitted by people who know the road.</p>
            <button className="primary-button" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>Find my tyres <span>→</span></button>
          </div>
          <div className="hero-art">
            <div className="tyre-ring">RR</div>
            <div className="hero-label"><strong>BUILT FOR<br />SOUTH AFRICA</strong><span>Adventure-ready since 1998</span></div>
          </div>
          <div className="hero-stats">
            <div><strong>25+</strong><span>years on the road</span></div>
            <div><strong>42</strong><span>fitment centres</span></div>
            <div><strong>4.9/5</strong><span>driver rating</span></div>
          </div>
        </section>
        <section className="finder" id="shop">
          <div className="section-intro">
            <p className="eyebrow">TYRE FINDER</p>
            <h2>Let’s find your perfect fit.</h2>
            <p>Search by your vehicle, tyre size or choose from our most popular categories.</p>
          </div>
          <div className="search-box">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘Toyota Hilux’ or ‘205/55 R16’" />
            <button onClick={() => notify(filtered.length ? `${filtered.length} tyres found` : 'Try another search')}>Search tyres</button>
          </div>
          <div className="category-tabs">{['All tyres', 'Premium', 'Touring', 'SUV & 4x4'].map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={`${product.brand} ${product.name}`} /><span>{product.category}</span></div><div className="product-content"><div className="product-brand">{product.brand}<span>★ {product.rating}</span></div><h3>{product.name}</h3><p>{product.size} · All-season performance</p><div className="product-footer"><strong>Request a quote</strong><button aria-label={`Add ${product.name} to quote`} onClick={() => { setQuoteOpen(true); notify(`${product.name} added to your quote`) }}>+</button></div></div></article>)}</div>
        </section>
        <section className="service-band" id="services">
          <div>
            <p className="eyebrow light">MORE THAN RUBBER</p>
            <h2>Everything your drive<br /><em>needs to move.</em></h2>
          </div>
          <div className="service-list">
            <div id="tyre-fitment"><span>01</span><strong>Tyre fitment</strong><p>Professional fitting, balancing and valve replacement.</p></div>
            <div id="wheel-alignment"><span>02</span><strong>Wheel alignment</strong><p>Correct tracking for safer handling and longer tyre life.</p></div>
            <div><span>03</span><strong>Wheel balancing</strong><p>Remove vibration and keep every drive smooth.</p></div>
            <div id="puncture-repair"><span>04</span><strong>Puncture repair</strong><p>Fast, reliable repairs for punctures and damaged tyres.</p></div>
            <div><span>05</span><strong>Tyre rotation</strong><p>Even tread wear to help your tyres last longer.</p></div>
            <div><span>06</span><strong>Tyre inspection</strong><p>Checks for tread, pressure, wear and road safety.</p></div>
            <div><span>07</span><strong>Battery checks</strong><p>Battery testing and replacement for confident starts.</p></div>
            <div id="roadside-assist"><span>08</span><strong>Roadside assist</strong><p>Help when a flat tyre or breakdown stops your journey.</p></div>
          </div>
        </section>
        <section className="promotions-strip" id="promotions"><p className="eyebrow">CURRENT PROMOTIONS</p><h2>More grip.<br /><em>More value.</em></h2><button className="primary-button" onClick={() => notify('Promotions are available at your nearest RoadReady store')}>View promotions <span>→</span></button></section>
        <section className="why-us" id="why-us">
          <div className="why-image"><img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85" alt="Motorcycle on an open road" /><div className="image-note">YOUR JOURNEY<br />MATTERS</div></div>
          <div className="why-copy">
            <p className="eyebrow">THE ROADREADY PROMISE</p>
            <h2>Good advice.<br /><em>No pressure.</em></h2>
            <p>We believe buying tyres should feel simple. Our specialists match you with what your car, your driving and your budget actually need.</p>
            <div className="promise-grid">
              <div><strong>01</strong><span>Honest recommendations</span></div>
              <div><strong>02</strong><span>Expert local fitment</span></div>
              <div><strong>03</strong><span>Guaranteed workmanship</span></div>
              <div><strong>04</strong><span>Tyres for every budget</span></div>
            </div>
            <button className="outline-button" onClick={() => { setBookingStep('details'); setBookingOpen(true) }}>Book a service <span>↗</span></button>
          </div>
        </section>
        <section className="location-strip" id="locations">
          <div>
            <p className="eyebrow">COME SEE US</p>
            <h2>Your nearest fitment centre<br /><em>is closer than you think.</em></h2>
          </div>
          <button className="primary-button" onClick={() => notify('Centre finder coming up — call 0800 123 456 for help')}>Find a centre <span>↗</span></button>
        </section>
        <section className="brochures-strip" id="brochures"><div><p className="eyebrow">ROADREADY RESOURCES</p><h2>Need a little<br /><em>more detail?</em></h2></div><button className="outline-button" onClick={() => notify('Brochure downloads will be available soon')}>Browse brochures <span>↗</span></button></section>
        <section className="quick-quote-section" id="quick-quote"><div className="quick-quote-copy"><p className="eyebrow">GET A QUICK QUOTE</p><h2>Your next drive<br /><em>starts here.</em></h2><p>Tell us what you need and our team will get back to you with expert advice and a clear quote.</p><div className="quote-points"><span>✓ No-pressure advice</span><span>✓ Fast response</span><span>✓ Expert fitment</span></div></div><form className="quick-quote-form" onSubmit={submitQuote}><div className="quote-form-row"><label>First name<input required value={quoteForm.firstName} onChange={(event) => handleQuoteChange('firstName', event.target.value)} placeholder="First name" /></label><label>Last name<input required value={quoteForm.lastName} onChange={(event) => handleQuoteChange('lastName', event.target.value)} placeholder="Last name" /></label></div><label>Email address<input required type="email" value={quoteForm.email} onChange={(event) => handleQuoteChange('email', event.target.value)} placeholder="you@example.com" /></label><label>Contact number<input required type="tel" value={quoteForm.phone} onChange={(event) => handleQuoteChange('phone', event.target.value)} placeholder="082 123 4567" /></label><label>Vehicle make and model<input required value={quoteForm.vehicle} onChange={(event) => handleQuoteChange('vehicle', event.target.value)} placeholder="e.g. Volkswagen Polo" /></label><label>What do you need?<select value={quoteForm.service} onChange={(event) => handleQuoteChange('service', event.target.value)}><option>Tyres</option><option>Wheel alignment</option><option>Wheel balancing</option><option>Battery</option><option>Brake service</option><option>General service</option></select></label><button className="primary-button" type="submit">Send my quote request <span>→</span></button></form></section>
        <section className="contact-strip" id="contact"><div><p className="eyebrow">CONTACT US</p><h2>Ready when<br /><em>you are.</em></h2></div><div className="contact-details"><a href="tel:0800123456">0800 123 456</a><a href="mailto:hello@roadready.co.za">hello@roadready.co.za</a><span>Mon–Fri · 07:30–17:00</span></div><button className="primary-button" onClick={() => { setBookingStep('details'); setBookingOpen(true) }}>Book now <span>→</span></button></section>
      </main>
      <footer><a className="logo" href="#top"><b>R</b><span>ROAD<span>READY</span></span></a><p>Tyres that keep South Africa moving.</p><div><a href="#shop">Shop</a><a href="#services">Services</a><a href="#why-us">About</a></div><small>© 2026 RoadReady Tyres</small></footer>
      {quoteOpen && <div className="modal-backdrop" onClick={() => setQuoteOpen(false)}><div className="quote-modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setQuoteOpen(false)}>×</button><p className="eyebrow">QUICK QUOTE</p><h2>Thanks — we received your request.</h2><p>Your quick quote request has been submitted and will be reviewed by an admin.</p><button className="primary-button" onClick={() => setQuoteOpen(false)}>Close <span>→</span></button></div></div>}
      {bookingOpen && <div className="modal-backdrop" onClick={() => setBookingOpen(false)}><div className="booking-modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setBookingOpen(false)}>×</button>{bookingStep === 'details' ? <><p className="eyebrow">BOOK A SERVICE</p><h2>Choose your<br /><em>appointment.</em></h2><form onSubmit={submitBooking}><label>Full name<input required value={bookingForm.name} onChange={(event) => handleBookingChange('name', event.target.value)} placeholder="Your name" /></label><label>Mobile number<input required value={bookingForm.phone} onChange={(event) => handleBookingChange('phone', event.target.value)} placeholder="e.g. 082 123 4567" /></label><label>Vehicle make and model<input required value={bookingForm.vehicle} onChange={(event) => handleBookingChange('vehicle', event.target.value)} placeholder="e.g. Toyota Hilux" /></label><label>Service<select value={bookingForm.service} onChange={(event) => handleBookingChange('service', event.target.value)}><option>Tyre fitment</option><option>Wheel alignment</option><option>Puncture repair</option><option>Wheel balancing</option><option>Tyre inspection</option><option>Roadside assistance</option></select></label><div className="booking-row"><label>Date<input required type="date" value={bookingForm.date} onChange={(event) => handleBookingChange('date', event.target.value)} /></label><label>Time<select value={bookingForm.time} onChange={(event) => handleBookingChange('time', event.target.value)}><option>09:00</option><option>11:00</option><option>13:00</option><option>15:00</option></select></label></div><button className="primary-button" type="submit">Continue to payment <span>→</span></button></form></> : <><p className="eyebrow">PAYMENT</p><h2>Secure your<br /><em>booking.</em></h2><p>Choose how you would like to pay your booking payment.</p><div className="payment-options"><button className={paymentMethod === 'payshap' ? 'payment-option active' : 'payment-option'} type="button" onClick={() => setPaymentMethod('payshap')}><strong>PayShap</strong><span>Instant mobile payment</span></button><button className={paymentMethod === 'bank' ? 'payment-option active' : 'payment-option'} type="button" onClick={() => setPaymentMethod('bank')}><strong>Bank transfer</strong><span>Use our banking details</span></button></div>{paymentMethod === 'bank' && <div className="bank-details"><strong>RoadReady Tyres</strong><span>FNB · Account: 620 400 12345</span><span>Branch: 250355</span><span>Use your name as reference</span></div>}<button className="primary-button" onClick={confirmPayment}>Confirm payment <span>→</span></button></>}</div></div>}
      <div className={chatOpen ? 'chat-widget open' : 'chat-widget'}><button className="chat-launcher" onClick={() => setChatOpen(!chatOpen)} aria-label="Open chat">{chatOpen ? '×' : '●'}<span>{chatOpen ? 'Close chat' : 'Chat with us'}</span></button>{chatOpen && <div className="chat-panel"><div className="chat-panel-head"><strong>RoadReady support</strong><span>Usually replies quickly</span></div><div className="chat-messages">{chatMessages.map((item) => <div key={item.id} className={`chat-message ${item.sender}`}><p>{item.message}</p><small>{item.time}</small></div>)}</div><form className="chat-input" onSubmit={sendChatMessage}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Type your message..." /><button type="submit">Send</button></form><div className="chat-actions"><a href="https://wa.me/27800123456" target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a><a href="tel:0800123456">Call <span>↗</span></a></div></div>}</div>
      {adminOpen && <div className="admin-overlay" onClick={() => { setAdminOpen(false); setAdminLoggedIn(false); setAdminLogin({ username: '', password: '' }) }}><div className="admin-panel" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => { setAdminOpen(false); setAdminLoggedIn(false); setAdminLogin({ username: '', password: '' }) }}>×</button>{!adminLoggedIn ? <div className="admin-login"><p className="eyebrow">ADMIN LOGIN</p><h2>Access booking and quote data.</h2><form onSubmit={handleAdminLogin}><label>Username<input value={adminLogin.username} onChange={(event) => setAdminLogin((prev) => ({ ...prev, username: event.target.value }))} placeholder="admin" /></label><label>Password<input type="password" value={adminLogin.password} onChange={(event) => setAdminLogin((prev) => ({ ...prev, password: event.target.value }))} placeholder="Password" /></label><button className="primary-button" type="submit">Login <span>→</span></button></form></div> : <div className="admin-dashboard"><div className="admin-header"><div><p className="eyebrow">ADMIN PANEL</p><h2>Booking, payment and quote requests</h2></div><button className="outline-button" onClick={() => { setAdminOpen(false); setAdminLoggedIn(false); setAdminLogin({ username: '', password: '' }) }}>Logout</button></div><div className="admin-nav"><button className={adminPage === 'bookings' ? 'active' : ''} onClick={() => setAdminPage('bookings')}>Bookings</button><button className={adminPage === 'quotes' ? 'active' : ''} onClick={() => setAdminPage('quotes')}>Quotes</button><button className={adminPage === 'chat' ? 'active' : ''} onClick={() => setAdminPage('chat')}>Chat</button></div>{adminPage === 'bookings' && <div className="admin-content"><table className="admin-table"><thead><tr><th>Name</th><th>Service</th><th>Schedule</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead><tbody>{bookings.length ? bookings.map((booking) => <tr key={booking.id}><td>{booking.name}<br /><small>{booking.phone}</small></td><td>{booking.service}</td><td>{booking.date} {booking.time}</td><td>{booking.paymentMethod}</td><td>{booking.paymentStatus}</td><td>{booking.paymentStatus !== 'Completed' ? <button className="outline-button" onClick={() => markBookingPaid(booking.id)}>Mark paid</button> : '—'}</td></tr>) : <tr><td colSpan="6">No bookings yet.</td></tr>}</tbody></table></div>}
            {adminPage === 'quotes' && <div className="admin-content"><table className="admin-table"><thead><tr><th>Customer</th><th>Service</th><th>Contact</th><th>Status</th><th>Action</th></tr></thead><tbody>{quoteRequests.length ? quoteRequests.map((quote) => <tr key={quote.id}><td>{quote.firstName} {quote.lastName}</td><td>{quote.service} / {quote.vehicle}</td><td>{quote.email}<br /><small>{quote.phone}</small></td><td>{quote.status}</td><td>{quote.status !== 'Responded' ? <button className="outline-button" onClick={() => markQuoteResponded(quote.id)}>Mark responded</button> : '—'}</td></tr>) : <tr><td colSpan="5">No quick quote requests yet.</td></tr>}</tbody></table></div>}
            {adminPage === 'chat' && <div className="admin-content"><div className="admin-chat-log">{chatMessages.map((item) => <div key={item.id} className={`chat-message ${item.sender}`}><strong>{item.sender === 'admin' ? 'Admin' : 'Customer'}</strong><p>{item.message}</p><small>{item.time}</small></div>)}</div><form className="admin-chat-form" onSubmit={sendAdminReply}><label>Reply to customer<input value={adminReply} onChange={(event) => setAdminReply(event.target.value)} placeholder="Type a reply..." /></label><button className="primary-button" type="submit">Send reply <span>→</span></button></form></div>}
          </div>}
        </div></div>}
    </>
  )
}

export default App
