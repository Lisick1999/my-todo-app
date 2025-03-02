import { useState } from "react";
import styles from './TodoItem.module.css';

export const TodoItem = ({ todo, onUpdate, onDelete }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(todo.title);

	const handleUpdate = () => {
		onUpdate(todo.id, editTitle);
		setIsEditing(false);
	};

	return (
		<li className={styles.todoItem}>
			{isEditing ? (
				<>
					<input
						type="text"
						value={editTitle}
						onChange={e => setEditTitle(e.target.value)}
					/>
					<button onClick={handleUpdate}>Сохранить</button>
					<button onClick={() => setIsEditing(false)}>Отменить</button>
				</>
			) : (
				<>
					<span>{todo.title}</span>
					<div className={styles.todoActions}>
						<button onClick={() => setIsEditing(true)}>Редактировать</button>
						<button onClick={() => onDelete(todo.id)}>Удалить</button>
					</div>
				</>
			)}
		</li>
	);
}
