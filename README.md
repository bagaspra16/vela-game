# VELA Game - Futuristic Crypto Gaming Platform

A cutting-edge gambling website featuring modern styling, 3D components, and innovative game concepts. Built with Next.js and utilizing localStorage for data persistence.

## Features

### Modern Design
- Futuristic UI with gold accents on dark backgrounds
- 3D Components powered by Three.js and React Three Fiber
- Glassmorphism effects
- Smooth animations with Framer Motion
- Fully responsive design

### Unique Games

#### 1. Cosmic Roulette
- Spin the cosmic wheel and predict where the star will land
- Bet on specific numbers (10x payout) or colors (2x payout)
- Min bet: $10 | Max bet: $1,000

#### 2. Crystal Slots
- Match mystical crystals for massive multipliers
- Three of a kind: Up to 100x payout
- Min bet: $5 | Max bet: $500

#### 3. Quantum Dice
- Roll the quantum dice and predict the outcome
- Adjustable target number for dynamic odds
- Min bet: $20 | Max bet: $2,000

#### 4. Stellar Crash
- Cash out before the star crashes
- Unlimited potential multiplier
- Min bet: $10 | Max bet: $5,000

### Data Persistence
- All data stored in localStorage
- No database required
- User balance, game history, and settings saved locally
- Starting balance: $10,000

## Tech Stack

- **Framework**: Next.js 14.2.5
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
vela-game/
├── app/
│   ├── games/
│   │   ├── cosmic-roulette/
│   │   ├── crystal-slots/
│   │   ├── quantum-dice/
│   │   └── stellar-crash/
│   ├── history/
│   ├── settings/
│   ├── login/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Hero3D.tsx
│   ├── Navigation.tsx
│   └── WalletProvider.tsx
├── lib/
│   └── storage.ts
└── public/
```

## Features in Detail

### User Management
- Simple username-based login
- No password required
- Instant account creation
- $10,000 starting balance

### Game History
- Track all games played
- View wins and losses
- Calculate win rate
- See net profit/loss

### Settings
- Toggle sound effects
- Toggle background music
- Enable/disable animations
- Reset all data option

### Wallet System
- Real-time balance updates
- Transaction history
- Win/loss tracking
- Persistent storage

## Color Scheme

- Primary Gold: #f59e0b
- Light Gold: #fbbf24
- Dark Gold: #d97706
- Dark Background: #0a0a0d
- Card Background: #18181b

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

## Author

Built with passion for the future of gaming.
