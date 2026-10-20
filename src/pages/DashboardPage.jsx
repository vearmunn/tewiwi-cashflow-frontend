import LogoutButton from '../components/LogoutButton';
import PageScaffold from '../components/PageScaffold';
import TransactionItem from '../components/transactionItem';
import '../index.css'

function Dashboard() {
    return (
        <PageScaffold>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Transaction History</h1>
                < a href='/categories'>
                    Categories
                </a>
                <LogoutButton />
            </div>
            <TransactionItem description='Pembelian Tepung 25kg' date='12 Okt 2026' category='Bahan Baku' type='Expense' amount='325.000' />
            <TransactionItem description='Pembelian Tepung 25kg' date='12 Okt 2026' category='Bahan Baku' type='Expense' amount='325.000' />
        </PageScaffold>
    )
}

export default Dashboard;