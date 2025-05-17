interface TablaResumenProps {
    data: any[];
    type: 'alumnos' ;
}

export default function TablaResumen({ data, type }: TablaResumenProps) {
    if (!data?.length) return <p className="text-muted">No hay registros recientes</p>;

    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    {type === 'alumnos' && (
                        <>
                            <th>Nombre</th>
                            <th>Email</th>
                        </>
                    )}
                   
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {type === 'alumnos' && (
                            <>
                                <td>{`${item.nombres} ${item.apellidos}`}</td>
                                <td>{item.email}</td>
                            </>
                        )}
                    
                    </tr>
                ))}
            </tbody>
        </table>
    );
}