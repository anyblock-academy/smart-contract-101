# Smart Contract 101 By AnyBlock.academy

Instructor: Bin Panasun (Ex. Software Engineer & DevOps Engineer, True Digital Group)

## Lending Contract 1

ตัวอย่างสัญญาในโลกความเป็นจริง

```
ข้าพเจ้านาย A ได้ยืมเงินนาย B 10000 บาท โดยสัญญาว่าจะคืนเงินต้นพร้อมดอกเบี้ยรวมทั้งสิ้น 10050 บาท
ทั้งนี้ข้าพเจ้านาย A และนาย B ได้เซ็นรับรองสัญญานี้แล้ว
```

ตัวอย่าง Smart Contract
[Lending1.sol](contract/Lending1.sol)
    
## Lending Contract 2

```
ข้าพเจ้านาย A ได้ขอยืม Token A จากนาย B จำนวน 10000 หน่วย
โดยสัญญาว่าจะคืน Token A ต้นพร้อมดอกเบี้ยรวมทั้งสิ้น 10050 หน่วย
ภายในระยะเวลา 1000 วินาที
และข้าพเจ้าได้วางหลักทรัพย์ค้ำประกันเป็น Token B จำนวน 15000 หน่วย
หากเกิน 1000 วินาที ไปแล้วข้าพเจ้าไม่ได้คืนตามจำนวนดังกล่าว ให้นาย B ยึด Token B ทั้งหมดไปได้เลย
```

ตัวอย่าง Smart Contract
[Lending2.sol](contract/Lending2.sol)
