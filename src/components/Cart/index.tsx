import { FlatList, TouchableOpacity } from 'react-native';

import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { MinusCircle } from '../Icons/MinusCircle';
import { PlusCircle } from '../Icons/PlusCircle';
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
}

export function Cart({ cartItems, onAdd, onDecrement }: CartProps) {
  const total = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);

  return (
    <>
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
            <Text color='#999'>Seu carrinho está vazio</Text>
          )}
        </Total>

        <Button
          disabled={cartItems.length === 0}
          onPress={() => console.log('')}
        >
          Confirmar pedido
        </Button>
      </Summary>
    </>
  );
}
