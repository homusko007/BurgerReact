import style from './OrderGoods.module.css';
import {Count} from '../Count/Count.jsx';
import {API_URI} from '../../const.js';


export const OrderGoods = ({title, price, image, count,id, weight}) => {

    return (
        <li className={style.item}>
        <img
          className={style.image}
          src={`${API_URI}/${image}`}
          alt={title}
        />

        <div className="goods">
          <h3 className={title}></h3>

          <p className={style.weight}>{weight}&nbsp;г</p>

          <p className={style.price}>
            {price}
            <span className="currency">&nbsp;₽</span>
          </p>
        </div>

        <Count count={count} id={id}/>
        </li>
    )
}