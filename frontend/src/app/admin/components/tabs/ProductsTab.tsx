import React from 'react';
import styles from '../../page.module.css';
import CatalogSubTab from './products/CatalogSubTab';
import CategoriesSubTab from './products/CategoriesSubTab';
import { Product } from '../../types';

export default function ProductsTab(props: any) {
  const { activeTab, activeSubTab } = props;
  
  return (
    <>
      {activeTab === "products" && activeSubTab === "all" && <CatalogSubTab {...props} />}
      {activeTab === "products" && activeSubTab === "categories" && <CategoriesSubTab {...props} />}
    </>
  );
}
