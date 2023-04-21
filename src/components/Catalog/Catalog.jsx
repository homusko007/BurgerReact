import style from "./Catalog.module.css";
import { Container } from "../Container/Container";
import { Order } from "../Order/Order";
import { CatalogProduct } from "../CatalorProduct/CatalogProduct";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { productRequestAsync } from "../../store/product/productSlice";

export const Catalog = () => {
  const { products, load } = useSelector((state) => state.product);
  const { category, activeCategory, loading } = useSelector(
    (state) => state.category
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (category.length) {
      dispatch(productRequestAsync(category[activeCategory].title));
    }
  }, [category, activeCategory]);

  return (
    <section className={style.catalog}>
      <Container className={style.container}>
        <Order />

        <div className={style.wrapper}>
          {loading ? (
            "Загрузка"
          ) : (
            <>
              <h2 className={style.title}>{category[activeCategory]?.rus}</h2>  
              <div className={style.wrap_list}>
                {load ? (
                  "Загрузка"
                ) : products.length ? (
                  <ul className={style.list}>
                    {products.map((item) => (
                      <li key={item.id} className={style.item}>
                        <CatalogProduct item={item} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={style.empty}>
                    К сожалению товаров в данной категории нет
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};
