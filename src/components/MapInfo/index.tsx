import _ from 'lodash';
import { Button } from 'primereact/button';
import { DATA } from '../../constants';
import { getFieldData } from '../../utils/getFieldData';
import { SortOrder } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Galleria } from 'primereact/galleria';
import { Tag } from 'primereact/tag';
import { Image as PrimereactImage } from 'primereact/image';
import { Ref, useEffect, useRef, useState } from 'react';
import { getSelectedTags } from '../../utils/getSelectedTags';

export const MapInfo = ({
  selectedMarker,
  setSelectedPath,
  setSelectedMarker,
  setActiveIndex,
  item,
  activeIndex,
  photos,
}: any) => {
  const galleriaRef: Ref<any> = useRef();
  const imgRef: Ref<any> = useRef();
  const ref: Ref<any> = useRef(null);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (ref.current?.offsetWidth) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref, item, activeIndex, photos]);

  const generateMapsLink = (address: string, directions = false) => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = directions
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    return googleMapsUrl;
  };

  const kvPairData = selectedMarker?.data
    ? {
        ...selectedMarker.data,
        hours: selectedMarker.data.hours,
      }
    : { _labels: {} };
  const kvPairs = Object.keys(kvPairData)
    .filter(
      (l) =>
        l !== '_labels' &&
        !!kvPairData[l] &&
        (!Array.isArray(kvPairData[l]) || kvPairData[l].length > 0),
    )
    .map((key) => ({
      key: Object.keys(kvPairData._labels).includes(key)
        ? kvPairData._labels[key]
        : _.startCase(key),
      value:
        key.toLowerCase() === 'park' &&
        DATA.park.data.find(
          ({ name }: { name: string }) => name === kvPairData[key],
        ) ? (
          <Button
            key={kvPairData[key]}
            link
            label={kvPairData[key]}
            style={{ background: 'transparent', border: 'none', padding: 4 }}
            onClick={() => {
              const selectable = [...DATA.park.data, ...DATA.center.data].find(
                (data: any) => {
                  return (
                    data.name === kvPairData[key] ||
                    data.properties?.name === kvPairData[key]
                  );
                },
              );
              const parent =
                selectedMarker?.properties?.park ?? selectedMarker?.park;
              const park = [...DATA.park.data, ...DATA.center.data].find(
                ({ name, properties }: any) =>
                  name === parent || name === properties?.name,
              );

              if (selectable) {
                setSelectedPath(null);
                setSelectedMarker({
                  ...selectable,
                  data: getFieldData(park, 'park'),
                  type: 'park',
                  title: selectable.name,
                  icon: null,
                  lat: selectable.latitude,
                  lng: selectable.longitude,
                  category: selectable.type,
                });
                setActiveIndex(0);
              }
            }}
          />
        ) : (
          kvPairData[key]
        ),
    }));

  const parentPark = selectedMarker?.properties?.park ?? selectedMarker?.park;
  const selectedAddress =
    selectedMarker?.properties?.address ||
    selectedMarker?.address ||
    (parentPark &&
      DATA.park.data.find(({ name }: { name: string }) => name === parentPark)
        ?.address);

  const selectedTags = getSelectedTags(selectedMarker);

  return (
    <Card className="sidebar" style={{ padding: 0, textAlign: 'left' }}>
      <div style={{ display: 'inline-block' }}>
        <h2 style={{ display: 'inline-block', marginTop: -8 }}>
          <Button
            className="back-button"
            text
            icon="pi pi-arrow-left"
            style={{ width: 48, marginBottom: -6 }}
            size="small"
            onClick={() => setSelectedMarker(null)}
            rounded
          />
          {selectedMarker.title}
        </h2>
      </div>
      {selectedTags.length > 0 && (
        <div className="tag-container">
          {selectedTags.map((tag) => (
            <Tag
              className="park-tag"
              key={tag.label}
              style={{
                backgroundColor: tag.color,
              }}
              icon={<tag.icon style={{ marginRight: 6 }} />}
            >
              {tag.label}
            </Tag>
          ))}
        </div>
      )}
      {photos.length > 0 && (
        <div
          className="grid img-container"
          style={{ margin: 0, position: 'relative' }}
        >
          <div className="col-fixed img-left">
            {activeIndex > 0 && (
              <Button
                type="button"
                className="img-button"
                icon="pi pi-chevron-left"
                onClick={() => setActiveIndex(activeIndex - 1)}
              ></Button>
            )}
          </div>
          <div className="col">
            <Button
              type="button"
              ref={ref}
              className="img-container"
              onClick={() => {
                imgRef.current?.show();
                galleriaRef.current?.stopSlideShow();
              }}
              style={{
                height: `${Math.floor(width * (2 / 3))}px`,
                backgroundImage: `url("${item}")`,
              }}
            >
              {photos.length > 1 && (
                <Badge
                  className="img-count"
                  value={`${activeIndex + 1}/${photos.length}`}
                ></Badge>
              )}
            </Button>
          </div>
          <div className="col-fixed img-right" style={{}}>
            {photos.length > 1 && activeIndex < photos.length - 1 && (
              <Button
                type="button"
                className="img-button"
                icon="pi pi-chevron-right"
                onClick={() => setActiveIndex(activeIndex + 1)}
              ></Button>
            )}
          </div>
          <PrimereactImage
            ref={imgRef}
            src={item}
            alt="Image"
            style={{ display: 'none' }}
            preview
          />
          <Galleria
            ref={galleriaRef}
            value={photos}
            circular
            style={{ display: 'none' }}
            showItemNavigators={false}
            activeIndex={activeIndex}
            showThumbnails={false}
          />
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        {selectedAddress && (
          <Card
            className="address-card"
            header={<div className="address-header">Address</div>}
          >
            <a
              href={generateMapsLink(selectedAddress)}
              target="_blank"
              rel="noreferrer"
              className="address-link"
            >
              {selectedAddress}
              <i className="pi pi-external-link" style={{ marginLeft: 12 }} />
            </a>
          </Card>
        )}
        {selectedMarker.description && (
          <p
            style={{ textAlign: 'left' }}
            dangerouslySetInnerHTML={{
              __html: selectedMarker.description,
            }}
          ></p>
        )}
      </div>
      {kvPairs && Object.keys(kvPairs).length > 0 && (
        <DataTable
          stripedRows
          value={kvPairs}
          sortField="key"
          sortOrder={SortOrder.ASC}
          className="info-table"
          size="small"
        >
          <Column field="key" header=""></Column>
          <Column
            field="value"
            header=""
            body={(info) => {
              let value = info.value;
              const regexp = new RegExp(
                /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
              );
              if (Array.isArray(value)) {
                value = (
                  <ul style={{ margin: 0 }}>
                    {value.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                );
              } else if (regexp.test(value)) {
                value = (
                  <a href={value} target="_blank" rel="noreferrer">
                    <i className="pi pi-external-link" />
                  </a>
                );
              }
              return <div>{value}</div>;
            }}
          ></Column>
        </DataTable>
      )}
    </Card>
  );
};
