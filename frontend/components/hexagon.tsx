import styles from '../styles/hexagon.module.css'
export const Hexagon = (props:any) => {
  return (
    <div className='ml-10'>
      <div className='mt-20'>
      </div>
      <div className={styles.hex}>
      <h1 className='text-white text-center font-bold'>UP</h1>
        <div className=''>{props.children}</div>
      </div>
    </div>
  );
};
