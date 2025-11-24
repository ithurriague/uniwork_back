export default async function seed(conn) {
    const skills = [
        {key: 'golang', label: 'Golang'},
        {key: 'c', label: 'C'},
        {key: 'rust', label: 'Rust'},
        {key: 'zig', label: 'Zig'},
    ];

    for (const {key, label} of skills) {
        // noinspection SqlNoDataSourceInspection,SqlResolve
        await conn.query(
            `
                INSERT INTO backend.skills (key, label)
                VALUES ($1, $2)
                ON CONFLICT (key) DO NOTHING
            `,
            [key, label],
        );
    }
}
