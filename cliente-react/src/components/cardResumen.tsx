interface CardResumenProps {
    title: string;
    count: number;
    color: string;
}

export default function CardResumen({ title, count, color }: CardResumenProps) {
    return (
        <div className="col-md-4 col-xl-4 col-sm-12 mb-2">
            <div className={`card border-${color} shadow-sm`}>
                <div className="card-body">
                    <h5 className={`card-title text-${color}`}>{title}</h5>
                    <p className="fs-3">{count} registros</p>
                </div>
            </div>
        </div>
    );
}
