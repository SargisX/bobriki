import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './services.module.css'
import { categories } from '../../../Servises.ts'

export const Services = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)



    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }


    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )


    const filteredServices = selectedCategory
        ? categories.find(category => category.name === selectedCategory)?.services.filter(service =>
            service.toLowerCase().includes(searchTerm.toLowerCase())
        ) : []

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search category or service..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
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
    )
}
