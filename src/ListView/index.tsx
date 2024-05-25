import { DATA } from '../constants';
export const ListView = () => {
  return (
    <div style={{ textAlign: 'left', padding: 12, marginTop: -16 }}>
      <h2>Parks</h2>
      <ul className="listview">
        {DATA.park.data
          .sort((a: any, b: any) => a.name - b.name)
          .map(({ name }: any) => (
            <li>{name}</li>
          ))}
      </ul>
    </div>
  );
};
