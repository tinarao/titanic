# Titanic passengers list

- [x] Отображение основной информации
- [x] Поиск по основным параметрам
- [x] Lazy load при скролле (сымитировал пагинацию как смог)

## Виртуализация
В [отдельной ветке](https://github.com/tinarao/titanic/tree/virtualization) есть реализация таблицы с применением виртуализации.
Вполне оправданный вариант, учитывая 1300+ элементов списка. Сэкономил около ~20 Мб памяти. 

Стилизация минимальная.

```sh
https://github.com/tinarao/titanic.git
cd titanic
npm i && npm run build && npm run preview 
```
