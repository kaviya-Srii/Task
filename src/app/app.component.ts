import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'form';

  transactionForm: FormGroup;
  transactions = signal<{ type: string; amount: number; reason: string }[]>([]);
  totalIncome = signal<number>(0);
  totalExpense = signal<number>(0);
  savings = signal<number>(0);
  expPercentage = signal<number>(0);
  savingspercent = signal<number>(0);

  constructor() {
    this.transactionForm = new FormGroup({
      type: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      reason: new FormControl('', Validators.required),
    });
  }

  onFormSubmit() {
    if (this.transactionForm.valid) {
      const newTransaction = this.transactionForm.value;
      this.transactions.update(transactions => [...transactions, newTransaction]);
      this.updateTotal();
      this.transactionForm.reset({ type: 'income' });
    }
  }

  private updateTotal() {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of this.transactions()) {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        totalExpense += transaction.amount;
      }
    }

    const totalAmt = totalIncome;
    const savings = totalAmt ? totalIncome - totalExpense : 0;
    const savingspercent = totalIncome ? (savings / totalIncome) * 100 : 0;
    const expPercentage = totalAmt ? (totalExpense / totalAmt) * 100 : 0;

    this.totalIncome.set(totalIncome);
    this.totalExpense.set(totalExpense);
    this.savings.set(savings);
    this.savingspercent.set(savingspercent);
    this.expPercentage.set(expPercentage);
  }
}
