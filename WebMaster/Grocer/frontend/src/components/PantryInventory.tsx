import React, { useState, useEffect } from 'react';
import './PantryInventory.css'; // Import CSS for styling

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
        setItems(data);
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
              <h2>{item.name} x{item.quantity}</h2>
              <div className = "categoryTag" 
                style={{backgroundColor: colorMap[item.category]}}
              >
                {item.category}
              </div>
            </div>
            <h5>Cheapest Price: ${item.price}</h5>
            <div className="color-indicator"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PantryInventory;
