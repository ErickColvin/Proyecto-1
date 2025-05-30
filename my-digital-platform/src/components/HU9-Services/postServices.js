
export async function postServ(s) {
    try {
        const res = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s)
        });
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
};


