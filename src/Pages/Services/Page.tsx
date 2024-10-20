import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './services.module.css';
import { categories } from '../../../DATA/servises.ts';

export const Services = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>('all'); // State for the selected filter

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilter(event.target.value);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredServices = selectedCategory
        ? categories.find(category => category.name === selectedCategory)?.services.filter(service =>
            service.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedFilter === 'all' || service.toLowerCase() === selectedFilter)
        ) : [];

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search category or service..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={`${styles.searchInput} ${selectedCategory === null ? styles.fullBorder : styles.serviceStyle}`}
                />
                {selectedCategory !== null && ( // Show the select only when a category is selected
                    <select 
                        value={selectedFilter} 
                        onChange={handleFilterChange} 
                        className={styles.filterSelect}
                    >
                        <option value="all">All</option>
                        {categories.find(category => category.name === selectedCategory)?.services.map((service, index) => (
                            <option key={index} value={service.toLowerCase()}>
                                {service}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {selectedCategory === null ? (
                <div className={styles.gridContainer}>
                    {filteredCategories.map((category, index) => (
                        <div
                            key={index}
                            className={styles.categoryItem}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.servicesContainer}>
                    <h2 className={styles.categoryTitle}>{selectedCategory}</h2>
                    {filteredServices?.map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                            <Link to={`/${service.toLowerCase().replace(/\s+/g, '-')}`}>
                                <button className={styles.serviceButton}>{service}</button>
                            </Link>
                        </div>
                    ))}
                    <button className={styles.backButton} onClick={() => setSelectedCategory(null)}>
                        Back to Categories
                    </button>
                </div>
            )}
        </div>
    );
};
