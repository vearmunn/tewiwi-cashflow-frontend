import { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import PageScaffold from '../components/PageScaffold';
import TransactionItem from '../components/transactionItem';
import '../index.css'
import { getCategories } from '../api/categoryApi';
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../api/transactionApi';
import TransactionForm from '../components/TransactionForm';
import ConfirmDeleteDialog from '../components/ConfirmDeletionDialog';

function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
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
        <PageScaffold>
            {loadingTransactions && <p>Loading</p>}
            {error && <p>{error}</p>}

            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Transaction History</h1>
                <div>
                    <button
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 mr-5"
                        onClick={() => handleAddClick()}
                    >
                        + Add Transaction
                    </button>
                    < a href='/categories' className='mr-5 font-semibold text-blue-600 hover:text-blue-700'>
                        Categories
                    </a>
                    <LogoutButton />
                </div>
            </div>
            {!loadingTransactions && !loadingCategories && transactions.map((transaction) => (
                <TransactionItem
                    key={transaction.id}
                    description={transaction.description}
                    date={transaction.date}
                    category={categories.find((item) => item.id === transaction.category_id).name}
                    type='Expense'
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
        </PageScaffold>
    )
}

export default Dashboard;