import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import { TodoItem } from '../components/TodoItem';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [newTodo, setNewTodo] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortByAlphabet, setSortByAlphabet] = useState(false);

	const API_URL = 'http://localhost:3000/todos';

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = () => {
		setLoading(true);
		fetch(API_URL)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				setTodos(data);
			})
			.catch(error => {
				setError(error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const addTodo = () => {
		if (newTodo.trim() === '') return;

		fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: newTodo }),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
				}
				return response.json();
			})
			.then(addedTodo => {
				setTodos([...todos, addedTodo]);
				setNewTodo('');
			})
			.catch(error => {
				setError(error);
			});
	};

	const updateTodo = (id, newTitle) => {
		fetch(`${API_URL}/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: newTitle }),
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
				}
				setTodos(todos.map(todo => (todo.id === id ? { ...todo, title: newTitle } : todo)));
			})
			.catch(error => {
				setError(error);
			});
	};

	const deleteTodo = (id) => {
		fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
				}
				setTodos(todos.filter(todo => todo.id !== id));
			})
			.catch(error => {
				setError(error);
			});
	};

	const filteredTodos = todos.filter(todo =>
		todo.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedTodos = sortByAlphabet
		? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
		: filteredTodos;

	if (loading) {
		return <div className={styles.loading}>Загрузка списка дел...</div>;
	}

	if (error) {
		return <div className={styles.error}>Ошибка: {error.message}</div>;
	}

	return (
		<div className={styles.container}>
			<h1>Todo List</h1>

			<div className={styles.addTodo}>
				<input
					type="text"
					placeholder="Добавить новое дело"
					value={newTodo}
					onChange={e => setNewTodo(e.target.value)}
				/>
				<button onClick={addTodo}>Добавить</button>
			</div>

			<div className={styles.search}>
				<input
					type="text"
					placeholder="Поиск дела"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</div>

			<div className={styles.sort}>
				<button onClick={() => setSortByAlphabet(!sortByAlphabet)}>
					{sortByAlphabet ? 'Отключить сортировку' : 'Сортировка по алфавиту'}
				</button>
			</div>

			<ul className={styles.todoList}>
				{sortedTodos.map(todo => (
					<TodoItem
						key={todo.id}
						todo={todo}
						onUpdate={updateTodo}
						onDelete={deleteTodo}
					/>
				))}
			</ul>
		</div>
	);
}
