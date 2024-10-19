import React, { useState } from 'react';
import styles from './admin.module.css'; 
import Terminal from '../../components/terminal/terminal'; 

export const Admin: React.FC = () => {
    // Store visibility states for each feature
    const [featureStates, setFeatureStates] = useState<{ [key: string]: boolean }>({
        Terminal: false,
        // You can add more features here with their initial visibility state
    });
    
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleToggleFeature = (featureName: string) => {
        setFeatureStates((prev) => ({
            ...prev,
            [featureName]: !prev[featureName], // Toggle the state for the specific feature
        }));
    };

    // Sample feature data (this can be expanded as needed)
    const features = [
        { name: 'Terminal', component: <Terminal /> },
        // Add more features here as needed
    ];

    // Filter features based on search term
    const filteredFeatures = features.filter(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        className={`${styles.searchInput} ${styles.mobileOnly}`} // Make it mobile-only
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
    );
};
