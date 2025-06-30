import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { productAPI } from '../services/backendAPIs';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.listProducts('burger').then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.psprdnme}</Text>
      <Text>{item.psprdcatdsc} - {item.psprdtypdsc}</Text>
      <Text>Price: {item.psprdpri}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={{ padding: 20 }}>No products found.</Text>}
    />
  );
}
