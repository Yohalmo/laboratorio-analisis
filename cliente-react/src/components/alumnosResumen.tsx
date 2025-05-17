interface TablaResumenProps {
    title: string;
    data: any[];
}

export default function TablaResumen({ title, data }: TablaResumenProps) {
    return (
        <div className="mb-3 col-xl-6 col-md-6 col-sm-12">
            <div className="card">
                <div className="card-body">
                    <h4 className="mb-3">{title}</h4>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.length ? (
                                data.map((item) => (
                                    <tr key={item.id_registro}>
                                        <td>{ item.field_registro}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>
                                        <p className="text-muted text-center">No hay registros recientes</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}