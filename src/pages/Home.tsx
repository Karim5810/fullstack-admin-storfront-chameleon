import React, { useEffect, useMemo, useState } from 'react';
import Hero from '../components/home/Hero';
import TrustStrip from '../components/home/TrustStrip';
import PromoGrid from '../components/home/PromoGrid';
import Categories from '../components/home/Categories';
import Products from '../components/home/Products';
import Services from '../components/home/Services';
import Brands from '../components/home/Brands';
import Deals from '../components/home/Deals';
import Certs from '../components/home/Certs';
import Stats from '../components/home/Stats';
import Blog from '../components/home/Blog';
import Newsletter from '../components/home/Newsletter';
import AppSection from '../components/home/AppSection';
import QuickModal from '../components/QuickModal';
import { api } from '../api';
import type { BlogPost, Category, Product, Service } from '../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productsData, postsData, servicesData, categoriesData] = await Promise.all([
          api.products.getAll(),
          api.blog.getAll(),
          api.services.getAll(),
          api.categories.getAll(),
        ]);

        setProducts(productsData);
        setPosts(postsData);
        setServices(servicesData);
        setCategories(categoriesData);
      } catch {
        setProducts([]);
        setPosts([]);
        setServices([]);
        setCategories([]);
      }
    };

    void loadHomeData();
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);
  const dealProducts = useMemo(() => {
    const saleProducts = products.filter((product) => Boolean(product.oldPrice)).slice(0, 5);
    return saleProducts.length > 0 ? saleProducts : products.slice(0, 5);
  }, [products]);
  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts]);
  const featuredServices = useMemo(() => services.slice(0, 8), [services]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <PromoGrid />
      <Categories categories={categories} products={products} />
      <Products products={featuredProducts} onOpenModal={setSelectedProduct} />
      <Services services={featuredServices} />
      <Brands />
      <Deals products={dealProducts} onOpenModal={setSelectedProduct} />
      <Certs />
      <Stats />
      <Blog posts={featuredPosts} />
      <Newsletter />
      <AppSection />
      <QuickModal isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} product={selectedProduct} />
    </>
  );
}
