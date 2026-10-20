function PageScaffold({ children }) {
    return (
        <div className="h-screen bg-slate-200 p-8">
            <div className='max-w-7xl mx-auto p-4 items-center bg-white rounded-xl'>
                {children}
            </div>
        </div>
    )
}
export default PageScaffold