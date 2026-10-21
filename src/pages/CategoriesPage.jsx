import PageScaffold from "../components/PageScaffold"
import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/categoryApi";
import ConfirmDeleteDialog from "../components/ConfirmDeletionDialog";
import CategoryForm from "../components/CategoryForm";

function CategoriesPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        const { error, data, message } = await getCategories()

        if (!error) {
            setCategories(data)
        } else {
            setError(message)
        }

        setLoading(false)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCategories();
    }, []);

    const handleAddClick = () => {
        setSelectedCategory(null);
        setIsOpen(true);
        setError("");
    };

    const handleAddCategory = async (category) => {
        setLoading(true)
        const { error, message } = await createCategory(category);
        if (error) {
            setError(message)
            setLoading(false)
        }
        // setIsOpen(false)
        await fetchCategories();
        setLoading(false)
    };

    const handleUpdateClick = (category) => {
        setSelectedCategory(category);
        setIsOpen(true);
        setError("");
    };

    const handleUpdateCategory = async (category) => {
        setLoading(true)
        const { error, message } = await updateCategory(category.id, category.name, category.type);
        if (error) {
            setError(message)
            setLoading(false)
        }
        setIsOpen(false)
        await fetchCategories();
        setLoading(false)
    };

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
        setError("");
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        setLoading(true)
        const { error, message } = await deleteCategory(selectedCategory.id);
        if (error) {
            setError(message)
            return
        }
        setIsDeleteOpen(false);
        setSelectedCategory(null);
        await fetchCategories();
        setLoading(false)
    };

    return (
        <PageScaffold>
            {loading && <p>Loading</p>}
            {error && <p>{error}</p>}
            <div>
                {!loading && <div>
                    <div className="flex justify-between">
                        <h1 className='text-2xl font-bold'>Category List</h1>
                        <button
                            onClick={() => handleAddClick()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            + Add Category
                        </button>
                    </div>
                    <div className="grid grid-cols-3 mt-6">
                        <p className="font-bold">Name</p>
                        <p className="font-bold text-center">Type</p>


                    </div>
                    {categories.map((category) => (
                        <div className="grid grid-cols-3 mt-6" key={category.id}>
                            <p className="">{category.name}</p>
                            <p className="text-center">{category.type}</p>
                            <div className="text-end">
                                <button className="text-blue-500 mr-6" onClick={() => handleUpdateClick(category)}>Update</button>
                                <button className="text-red-500" onClick={() => handleDeleteClick(category)}>Delete</button>
                            </div>
                        </div>
                    ))}

                    <ConfirmDeleteDialog
                        isOpen={isDeleteOpen}
                        onClose={() => {
                            setIsDeleteOpen(false);
                            setSelectedCategory(null);
                        }}
                        onConfirm={handleDeleteCategory}
                        itemName={selectedCategory?.name || "category"}
                        loading={loading}
                    />
                </div>}
                <CategoryForm
                    key={selectedCategory?.id ?? "new"}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onAdd={handleAddCategory}
                    onUpdate={handleUpdateCategory}
                    selectedCategory={selectedCategory}
                />
            </div>

        </PageScaffold>
    )
}
export default CategoriesPage