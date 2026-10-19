import TransactionItem from '../components/transactionItem';
import '../index.css'

function Dashboard() {
    return (
        <div className="h-screen bg-slate-200 p-8">
            <div className='max-w-7xl mx-auto p-4 items-center bg-white rounded-xl'>
                <h1 className='text-2xl font-bold'>Transaction History</h1>
                <TransactionItem description='Pembelian Tepung 25kg' date='12 Okt 2026' category='Bahan Baku' type='Expense' amount='325.000' />
                <TransactionItem description='Pembelian Tepung 25kg' date='12 Okt 2026' category='Bahan Baku' type='Expense' amount='325.000' />

            </div>
        </div>
    )
}

export default Dashboard;