export default function Filter({showRead, setShowRead, sortBy, setSortBy}) {
  return (
    <div className="my-2 text-center items-center p-2">
    {/* Option to show or hide read emails */}
    <label className="mr-8">
        <input
            className="mr-2 cursor-pointer"
            type="checkbox"
            checked={showRead}
            onChange={() => setShowRead(!showRead)}
        />
        Montrer les emails lus
    </label>
    {/* Option to sort emails by date or recipient */}
    <select
        className="border-2 border-slate-600 p-1 bg-slate-900 w-48 hover:bg-slate-700 cursor-pointer"
        onChange={(e) => setSortBy(e.target.value)}
        value={sortBy}>
        <option value="date">Trier par date</option>
        <option value="recipient">
            Trier par destinataire
        </option>
    </select>
</div>
)
}
