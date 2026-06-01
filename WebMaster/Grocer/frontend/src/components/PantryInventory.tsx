import React, { useState, useEffect } from 'react';
import './PantryInventory.css'; // Import CSS for styling
import yellowStar from '../assets/yellow-star.png';
import starEmpty from '../assets/star-empty.svg';

const colorMap = {
    'Fruit': 'tomato',
    'Vegetable': 'limegreen',
    'Dairy': 'lightgray',
    'Meat': 'pink',
    'Grain': 'orange'
}

const PantryInventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/store/items')
      .then(res => res.json())
      .then(data => {
        setItems(data.map((item: any) => ({ ...item, favorite: Boolean(item.favorite) })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching items:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div><h2>Pantry Inventory</h2><p>Loading...</p></div>;

  return (
    <div>
      <h2>Pantry Inventory</h2>
      <ul>
        {items.map((item) => (
          <li className="pantry-item" key={item.id}>
            <div className = "title"
              style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}
            >
              <h2>{item.name}</h2>
              <div className = "categoryTag" 
                style={{backgroundColor: colorMap[item.category]}}
              >
                {item.category}
              </div>
            </div>
            <h5>Cheapest Price: ${item.price}</h5>
            <div className="quantity">Quantity: {item.quantity}</div>
            <img className="favorite-icon" src={item.favorite ? yellowStar : starEmpty} alt={"Favorite"} width="20" height="20" 
              onClick={() => {
                const newFavorite = !item.favorite;
                fetch(`http://localhost:3001/api/store/items/${item.id}/favorite`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ favorite: newFavorite }),
                })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    setItems(items.map(i => i.id === item.id ? { ...i, favorite: newFavorite } : i));
                  }
                })
                .catch(err => console.error('Error toggling favorite:', err));
              }}
            />
            <div className="color-indicator"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PantryInventory;
