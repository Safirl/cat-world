import {useState} from "react";

const Register = () => {
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (response.ok) {
                setMessage(data.message);
            }
            else {
                setMessage(data.message || "Something went wrong with registration");
            }
        }
        catch (error) {
            console.error(error);
            setMessage("An error occurred");
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Register</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Register;