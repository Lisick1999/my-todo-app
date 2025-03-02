import React, { useState, useEffect } from 'react';
import styles from './App.module.css';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const response = await fetch('https://jsonplaceholder.typicode.com/todos');

				if (!response.ok) {
					throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
				}

				const data = await response.json();
				setTodos(data);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchTodos();
	}, []);

	if (loading) {
		return <div className={styles.loading}>Загрузка списка дел…</div>;
	}

	if (error) {
		return (
			<div className={styles.error}>
				Ошибка при получении списка дел: {error.message}
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h1>Todo List</h1>
			<ul className={styles.todoList}>
				{todos.map(todo => (
					<li key={todo.id} className={styles.todoItem}>
						{todo.title}
					</li>
				))}
			</ul>
		</div>
	);
}
