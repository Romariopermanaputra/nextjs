import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('sh1rohosh1', 10);

        // Insert the new user
        await sql`
            INSERT INTO users (id, name, email, password)
            VALUES (
                uuid_generate_v4(),
                'Romario Permana Putra',
                'romariopermanaputra@gmail.com',
                ${hashedPassword}
            )
            ON CONFLICT (email) DO UPDATE SET password = ${hashedPassword};
        `;

        return Response.json({ message: 'User created successfully!' });
    } catch (error) {
        console.error('Error creating user:', error);
        return Response.json({ error: String(error) }, { status: 500 });
    }
}
