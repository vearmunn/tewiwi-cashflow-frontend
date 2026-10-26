import { useEffect, useState } from 'react';
import TransactionItem from '../components/transactionItem';
import '../index.css'
import { getCategories } from '../api/categoryApi';
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../api/transactionApi';
import TransactionForm from '../components/TransactionForm';
import ConfirmDeleteDialog from '../components/ConfirmDeletionDialog';
import CustomContainer from '../components/CustomContainer';
import expenseIcon from "../assets/expense.png";
import incomeIcon from "../assets/income.png";
import transactionIcon from "../assets/transaction.png";
import cashflowIcon from "../assets/cashflow.png";
import SummaryItem from '../components/SummaryItem';
import calculateTransaction from '../utils/calculateTransaction';
import { formatRupiah } from '../utils/formatRupiah';

function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null)
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        setLoadingCategories(true)
        const { error, data, message } = await getCategories()

        if (!error) {
            setCategories(data)

        } else {
            setError(message)
        }

        setLoadingCategories(false)
    }

    const fetchTransactions = async () => {
        setLoadingTransactions(true)
        const { error, data, message } = await getTransactions()

        if (!error) {
            setTransactions(data)
            setSummary({
                'income': calculateTransaction(data, 'income'),
                'expense': calculateTransaction(data, 'expense')
            })
        } else {
            setError(message)
        }

        setLoadingTransactions(false)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCategories();
        fetchTransactions();
    }, []);

    const handleAddClick = () => {
        setSelectedTransaction(null);
        setIsOpen(true);
        setError("");
    };

    const handleAddTransaction = async (transaction) => {
        setLoadingTransactions(true)
        const { error, message } = await createTransaction(transaction);
        if (error) {
            setError(message)
            setLoadingTransactions(false)
        }
        // setIsOpen(false)
        await fetchTransactions();
        setLoadingTransactions(false)
    };

    const handleUpdateClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsOpen(true);
        setError("");
    };

    const handleUpdateTransaction = async (transaction) => {
        setLoadingTransactions(true)
        const { error, message } = await updateTransaction(transaction.id, { description: transaction.description, amount: transaction.amount, categoryId: transaction.categoryId, date: transaction.date });
        if (error) {
            setError(message)
            setLoadingTransactions(false)
        }
        setIsOpen(false)
        await fetchTransactions();
        setLoadingTransactions(false)
    };

    const handleDeleteClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteOpen(true);
        setError("");
    };

    const handleDeleteTransaction = async () => {
        if (!selectedTransaction) return;
        setLoadingTransactions(true)
        const { error, message } = await deleteTransaction(selectedTransaction.id);
        if (error) {
            setError(message)
            return
        }
        setIsDeleteOpen(false);
        setSelectedTransaction(null);
        await fetchTransactions();
        setLoadingTransactions(false)
    };

    return (
        <div className="h-screen bg-slate-200 p-8">
            {loadingTransactions ? <p>Loading</p> :
                <div className='max-w-7xl mx-auto items-center'>
                    <h1 className='text-2xl font-bold mb-4'>Summary</h1>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <SummaryItem title='Income' value={formatRupiah(summary.income)} icon={incomeIcon} iconColor='bg-green-500' />
                        <SummaryItem title='Expense' value={(formatRupiah(summary.expense))} icon={expenseIcon} iconColor='bg-red-400' />
                        <SummaryItem title='Net Cashflow' value={formatRupiah(summary.income - summary.expense)} icon={cashflowIcon} iconColor='bg-blue-400' />
                        <SummaryItem title='Transactions' value={transactions.length} icon={transactionIcon} iconColor='bg-amber-400' />
                    </div>
                </div>}

            <br />

            <CustomContainer>
                {loadingTransactions && <p>Loading</p>}
                {error && <p>{error}</p>}
                <div className='flex items-center justify-between'>
                    <h1 className='text-2xl font-bold'>Recent Transaction</h1>
                    <div>
                        <button
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            onClick={() => handleAddClick()}
                        >
                            + Add Transaction
                        </button>
                    </div>
                </div>
                {!loadingTransactions && !loadingCategories && transactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        description={transaction.description}
                        date={transaction.date}
                        category={categories.find((item) => item.id === transaction.category_id).name}
                        type={transaction.category_type}
                        amount={transaction.amount}
                        onClickDelete={() => handleDeleteClick(transaction)}
                        onClickUpdate={() => handleUpdateClick(transaction)}
                    />
                ))}

                <ConfirmDeleteDialog
                    isOpen={isDeleteOpen}
                    onClose={() => {
                        setIsDeleteOpen(false);
                        setSelectedTransaction(null);
                    }}
                    onConfirm={handleDeleteTransaction}
                    itemName={selectedTransaction?.description || "transaction"}
                    loading={loadingTransactions}
                />
                {!loadingTransactions && !loadingCategories && <TransactionForm
                    key={selectedTransaction?.id ?? "new"}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onAdd={handleAddTransaction}
                    onUpdate={handleUpdateTransaction}
                    categories={categories}
                    selectedTransaction={selectedTransaction}
                />}
            </CustomContainer>
        </div>

    )
}

export default Dashboard;