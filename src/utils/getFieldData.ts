export const getFieldData = (data: any, type: string) => {
  const getSharedFields = (d: any) => ({
    park: d['park'] ?? d.properties?.['park'],
    hours: d['hours'],
    features: d['features'],
    accessibilityInfo: d['accessibility'],
    wikipedia: d['url'],
  });

  console.log('type', type);
  if (
    [
      'basketball',
      'tennis',
      'soccer',
      'biking',
      'baseball',
      'golf',
      'skateboard',
      'iceskate',
    ].includes(type)
  ) {
    data = {
      ...getSharedFields(data),
      _labels: {
        courtSize_quantity: 'Court Size (Quantity)',
      },
      courtType: data.properties?.['COURT_TYPE'],
      courtSize_quantity: data.properties?.['COURT_SIZE___QUANTITY'],
    };
  } else if (['mural', 'mosaic', 'sculpture'].includes(type)) {
    data = {
      ...getSharedFields(data),
      _labels: {},
      artType: data.properties['type'],
      artist:
        `${data.properties['Artist_First'] || ''} ${data.properties?.['Artist_Last_'] || ''}`.trim(),
      additionalArtists: data.properties?.['Additional_Artists'],
      media: data.properties?.['Media'],
      yearCreated: data.properties?.['Year_Created'],
      yearErected: data.properties?.['Year_Erected'],
      neighborhood: data.properties?.['Neighborhood'],
      specificLocation: data.properties?.['Specific_Location'],
    };
  } else if (type === 'pool') {
    data = {
      ...getSharedFields(data),
      _labels: {
        hasRamp: 'Accessible Pool Ramp',
        lengthwidth: 'Length x Width',
      },
      poolType: data.properties?.['type'],
      hasRamp: data.properties?.['Accessible_Pool_Ramp'],
      lengthwidth: data.properties?.['Length_x_Width'],
      depth: data.properties?.['Depth'],
      rules: 'https://www.syr.gov/Departments/Parks-Recreation/Pool-Rules',
    };
  } else {
    data = {
      ...getSharedFields(data),
      _labels: {},
    };
  }

  return data;
};
