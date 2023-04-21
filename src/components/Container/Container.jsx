import style from './Container.module.css';
import classNames from 'classnames'; 

export const Container = ({children, className}) => (
    <div className={classNames(style.container, className)}>
        {children}
    </div>
);