export default async function seed(conn) {
    const categories = [
        {name: 'it'},
        {name: 'marketing'},
        {name: 'legal'},
        {name: 'business'},
    ];

    for (const category of categories) {
        // noinspection SqlNoDataSourceInspection,SqlResolve
        await conn.query(
            `
                INSERT INTO backend.categories (name)
                VALUES ($1) ON CONFLICT (name) DO NOTHING
            `,
            [category.name],
        );
    }
}
