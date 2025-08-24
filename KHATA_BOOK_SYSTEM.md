# Traditional Khata Book System

A simple digital khata book system for maintaining traditional ledgers like physical khata books used by shopkeepers and small businesses.

## 🎯 Features

### Core Features
- **Simple Khata Management**: Create and manage khata books for different people
- **Traditional Ledger Entries**: Add credit (given) and debit (received) entries
- **Auto Balance Calculation**: Automatic balance updates after each entry
- **Person Details**: Store name, phone, address, and notes for each person
- **Transaction History**: Complete history of all entries for each khata

### Simple Interface
- **Clean Design**: Simple and intuitive interface
- **Search Functionality**: Search khatas by name or phone number
- **Summary Overview**: Quick view of total amounts and balances
- **Mobile Friendly**: Works well on mobile devices

## 📱 How to Use

### Creating a New Khata
1. Click "New Khata" button
2. Enter person's name (required)
3. Add phone number (optional)
4. Add address (optional)
5. Add any notes (optional)
6. Click "Create Khata"

### Adding Entries
1. Open a khata by clicking on it
2. Click "Add Entry" button
3. Select type: Credit (Given) or Debit (Received)
4. Enter amount
5. Add description of the transaction
6. Set date (defaults to today)
7. Add optional notes
8. Click "Add Entry"

### Understanding Balances
- **Credit (Given)**: Amount you gave to the person (increases balance)
- **Debit (Received)**: Amount you received from the person (decreases balance)
- **Current Balance**: Shows how much the person owes you (positive) or you owe them (negative)

## 🔧 Technical Details

### Backend
- **Node.js + Express**: Simple API server
- **MongoDB**: Database for storing khatas and entries
- **JWT Authentication**: Secure user access

### Frontend
- **React**: User interface
- **Tailwind CSS**: Styling
- **Responsive Design**: Works on all devices

### Database Models

#### KhataBook
```javascript
{
  userId: ObjectId,
  personName: String,
  phone: String,
  address: String,
  notes: String,
  totalCredit: Number,
  totalDebit: Number,
  currentBalance: Number,
  status: 'active' | 'closed'
}
```

#### KhataEntry
```javascript
{
  khataId: ObjectId,
  userId: ObjectId,
  type: 'credit' | 'debit',
  amount: Number,
  description: String,
  transactionDate: Date,
  balanceAfter: Number,
  notes: String
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Backend (.env)
   MONGODB_URI=mongodb://localhost:27017/khata_system
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```

4. **Start the application**
   ```bash
   # Start backend
   cd backend
   npm start
   
   # Start frontend (in new terminal)
   cd frontend
   npm run dev
   ```

## 📊 API Endpoints

### Khata Management
- `POST /api/khata` - Create new khata
- `GET /api/khata` - Get all khatas
- `GET /api/khata/:id` - Get specific khata
- `PUT /api/khata/:id` - Update khata
- `DELETE /api/khata/:id` - Close khata

### Entries
- `POST /api/khata/:id/entries` - Add entry
- `GET /api/khata/:id/entries` - Get entries

### Summary
- `GET /api/khata/summary` - Get summary statistics

## 💡 Usage Tips

1. **Keep Descriptions Clear**: Write clear descriptions for each transaction
2. **Regular Updates**: Update entries regularly to maintain accurate balances
3. **Use Notes**: Add notes for important transactions or reminders
4. **Search Function**: Use the search to quickly find specific khatas
5. **Review Regularly**: Check your summary regularly to track outstanding amounts

## 🔒 Security

- **User Authentication**: Each user can only access their own khatas
- **Data Validation**: All inputs are validated on the server
- **Secure API**: JWT tokens for API access

## 📱 Mobile Usage

The system is designed to work well on mobile devices:
- Touch-friendly buttons
- Responsive design
- Easy navigation
- Quick entry forms

## 🆘 Support

For issues or questions:
1. Check the browser console for errors
2. Verify your internet connection
3. Make sure the backend server is running
4. Check that MongoDB is running

---

**Simple, Traditional, Digital Khata Book System**
