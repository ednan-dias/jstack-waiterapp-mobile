import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { MinusCircle } from '../Icons/MinusCircle';
import { PlusCircle } from '../Icons/PlusCircle';
import { OrderConfirmedModal } from '../OrderConfirmedModal';
import { Text } from '../Text';

import {
  Actions,
  Image,
  Item,
  ProductContainer,
  Quantity,
  ProductDetails,
  Summary,
  Total,
} from './styles';

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
  selectedTable: string;
}

export function Cart({
  cartItems,
  onAdd,
  onDecrement,
  onConfirmOrder,
  selectedTable,
}: CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const total = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);

  async function handleConfirmOrder() {
    setIsLoading(true);

    await api.post('/orders', {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
      })),
    });

    setIsLoading(false);
    setIsModalVisible(true);
  }

  function handleOk() {
    setIsModalVisible(false);
    onConfirmOrder();
  }

  return (
    <>
      <OrderConfirmedModal
        visible={isModalVisible}
        onOk={handleOk}
      />

      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          keyExtractor={(cartItem) => cartItem.product._id}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 20, maxHeight: 150 }}
          renderItem={({ item: cartItem }) => (
            <Item>
              <ProductContainer>
                <Image
                  source={{
                    uri: `http://192.168.0.107:3001/uploads/${cartItem.product.imagePath}`,
                  }}
                />

                <Quantity>
                  <Text
                    size={14}
                    color='#666'
                  >
                    {cartItem.quantity}x
                  </Text>
                </Quantity>
              </ProductContainer>

              <ProductDetails>
                <Text
                  size={14}
                  weight='600'
                >
                  {cartItem.product.name}
                </Text>

                <Text
                  size={14}
                  color='#666'
                  style={{ marginTop: 4 }}
                >
                  {formatCurrency(cartItem.product.price)}
                </Text>
              </ProductDetails>

              <Actions>
                <TouchableOpacity
                  onPress={() => onAdd(cartItem.product)}
                  style={{ marginRight: 24 }}
                >
                  <PlusCircle />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDecrement(cartItem.product)}>
                  <MinusCircle />
                </TouchableOpacity>
              </Actions>
            </Item>
          )}
        />
      )}

      <Summary>
        <Total>
          {cartItems.length > 0 ? (
            <>
              <Text color='#666'>Total</Text>
              <Text
                size={20}
                weight='600'
              >
                {formatCurrency(total)}
              </Text>
            </>
          ) : (
            <Text color='#999'>Seu carrinho est?? vazio</Text>
          )}
        </Total>

        <Button
          disabled={cartItems.length === 0}
          onPress={handleConfirmOrder}
          loading={isLoading}
        >
          Confirmar pedido
        </Button>
      </Summary>
    </>
  );
}
