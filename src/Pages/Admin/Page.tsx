import React, { useState } from 'react'
import styles from './admin.module.css'
import Terminal from '../../components/terminal/terminal'

export const Admin: React.FC = () => {

    const [featureStates, setFeatureStates] = useState<{ [key: string]: boolean }>({
        Terminal: false,

    })

    const [searchTerm, setSearchTerm] = useState<string>('')

    const handleToggleFeature = (featureName: string) => {
        setFeatureStates((prev) => ({
            ...prev,
            [featureName]: !prev[featureName],
        }))
    }


    const features = [
        { name: 'Terminal', component: <Terminal /> },

    ]


    const filteredFeatures = features.filter(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className={styles.bg}>
            <div className={styles.adminContainer}>
                <div className={styles.sidebar}>
                    <h3>Admin Panel</h3>
                    <input
                        type="text"
                        placeholder="Search features..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${styles.searchInput} ${styles.mobileOnly}`}
                    />
                    {filteredFeatures.map((feature) => (
                        <button
                            key={feature.name}
                            onClick={() => handleToggleFeature(feature.name)}
                            className={styles.toggleButton}
                        >
                            {featureStates[feature.name] ? `Hide ${feature.name}` : `Show ${feature.name}`}
                        </button>
                    ))}
                </div>
                <div className={styles.content}>
                    {filteredFeatures.map((feature) => (
                        featureStates[feature.name] && (
                            <div key={feature.name}>
                                {feature.component}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    )
} 
