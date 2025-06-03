export default function TableComponent({ columns, data }) {
    return (
        <div className="overflow-x-auto max-h-96 border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {columns.map((key) => (
                            <th
                                key={key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-100">
                            {columns.map((column) => (
                                <td
                                    key={`${item.id}-${column}`}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {item[column]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
